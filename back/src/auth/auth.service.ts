import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { Roles } from '../roles/entities/roles.entity';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './types/register-dto.type';
import { ProfileFactory } from './profile.factory';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

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

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = manager.create(User, {
          email: dto.email,
          password: hashedPassword,
          phone: dto.phone,
          address: dto.address,
          country: dto.country,
          role,
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

    const payload = {
      id: foundUser.id,
      role: foundUser.role.name,
    };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Usuario Logeado',
      token,
    };
  }
}
