import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/roles.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './types/register-dto.type';
import { ProfileFactory } from './profile.factory';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';
import { ROLE_CATALOG } from '../roles/constants/role-catalog.constant';
import { UserStatus } from '../common/enums/user-status.enum';
import { RegisterOperatorDto } from './dto/register-operator.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly profileFactory: ProfileFactory,
    private readonly rolesService: RolesService,
  ) {}

  async signUp(dto: RegisterDto, roleName: Role): Promise<string> {
    if (!this.rolesService.isSelfSignUpAllowed(roleName)) {
      throw new BadRequestException(
        `El rol "${roleName}" no está habilitado para registro público`,
      );
    }

    const existingUser = await this.usersRepository.getUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    try {
      // DataSource.transaction maneja commit/rollback de forma automatica
      return await this.dataSource.transaction(async (manager) => {
        const role: Roles | null =
          await this.rolesService.getRoleByName(roleName, manager);
        if (!role) {
          throw new BadRequestException(`El rol "${roleName}" no existe`);
        }

        const initialStatus = ROLE_CATALOG[roleName].requiresApproval ? UserStatus.PENDING : UserStatus.APPROVED;

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = manager.create(User, {
          email: dto.email,
          password: hashedPassword,
          role,
          status: initialStatus,
        });
        const savedUser = await manager.save(user);

        await this.profileFactory.createByRole(roleName, dto, savedUser, manager);
        return savedUser.id;
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as {
          code?: string;
          constraint?: string;
        };

        if (driverError?.code === '23505') {
          throw new ConflictException('El email ya se encuentra registrado');
        }
      }

      throw error;
    }
  }

  async signIn(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const foundUser = await this.usersRepository.getUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestException('Email o password Incorrectos');
    }

    if (!foundUser.is_active) {
      throw new BadRequestException('La cuenta se encuentra desactivada');
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      throw new BadRequestException('Email o password Incorrectos');
    }

    if (foundUser.status !== UserStatus.APPROVED) {
      throw new BadRequestException('La cuenta aún no ha sido aprobada o fue rechazada');
    }

    if (foundUser.role.name === Role.Operator) {
      if (!foundUser.parentCompany || foundUser.parentCompany.status !== UserStatus.APPROVED) {
        throw new BadRequestException('La empresa contratista no está autorizada para operar');
      }
    }

    const payload = {
      id: foundUser.id,
      role: foundUser.role.name,
      status: foundUser.status,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario Logeado',
      token,
    };
  }

  async registerOperator(dto: RegisterOperatorDto, companyId: string): Promise<string> {
    const parentCompany = await this.usersRepository.getUserById(companyId);
    if (!parentCompany) {
      throw new BadRequestException('Empresa no encontrada');
    }

    const roleName = Role.Operator;
    const existingUser = await this.usersRepository.getUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('El email ya se encuentra registrado');
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const role = await this.rolesService.getRoleByName(roleName, manager);
        if (!role) throw new BadRequestException(`El rol "${roleName}" no existe`);

        const initialStatus = ROLE_CATALOG[roleName].requiresApproval ? UserStatus.PENDING : UserStatus.APPROVED;
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        
        const user = manager.create(User, {
          email: dto.email,
          password: hashedPassword,
          role,
          status: initialStatus,
          parentCompany: { id: parentCompany.id } as User,
        });
        const savedUser = await manager.save(user);

        await this.profileFactory.createByRole(roleName, dto, savedUser, manager);
        return savedUser.id;
      });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code?: string };
        if (driverError?.code === '23505') {
          throw new ConflictException('El email ya se encuentra registrado');
        }
      }
      throw error;
    }
  }
  async googleSignIn(dto: GoogleAuthDto) {
  // Si el usuario ya existe, generamos token directamente
  let user = await this.usersRepository.getUserByEmail(dto.email);
  const isNew = !user

  if (!user) {
    // Usuario nuevo: lo creamos en una transacción
    await this.dataSource.transaction(async (manager) => {
      const role = await this.rolesService.getRoleByName(Role.User, manager);
      if (!role) throw new BadRequestException('Rol no encontrado');

      // Contraseña aleatoria porque Google maneja la auth
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36),
        10,
      );

      const newUser = manager.create(User, {
        email: dto.email,
        password: randomPassword,
        role,
        status: UserStatus.APPROVED, // Google ya validó el email
      });
      const savedUser = await manager.save(newUser);

      const [first_name, ...rest] = dto.name.trim().split(' ');
      const last_name = rest.join(' ') || '';

      await this.profileFactory.createByRole(
        Role.User,
        {
          email: dto.email,
          password: randomPassword,
          first_name,
          last_name,
          gender: null,
          birthdate: null,
          address: 'Google Default',
          phone: '0000000000',
          country: 'US',
        } as unknown as RegisterUserDto,
        savedUser,
        manager,
      );

      user = savedUser;
    });
  }

  if (!user!.is_active) {
    throw new BadRequestException('La cuenta se encuentra desactivada');
  }

  const payload = {
    id: user!.id,
    role: user!.role.name,
    status: user!.status,
  };

  const token = this.jwtService.sign(payload);
  return { message: 'Usuario autenticado con Google', token, isNew };
}
}
