import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
import { OtpService } from '../notifications/services/otp.service';
import { OtpType } from '../notifications/enums/otp-type.enum';
import {
  NOTIFICATION_EVENTS,
  UserRegisteredPayload,
  PasswordResetRequestedPayload,
  OtpResendRequestedPayload,
} from '../notifications/events/notification-events';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
    private readonly profileFactory: ProfileFactory,
    private readonly rolesService: RolesService,
    private readonly eventEmitter: EventEmitter2,
    private readonly otpService: OtpService,
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
      const userId = await this.dataSource.transaction(async (manager) => {
        const role: Roles | null =
          await this.rolesService.getRoleByName(roleName, manager);
        if (!role) {
          throw new BadRequestException(`El rol "${roleName}" no existe`);
        }

        // DESACTIVADO: La verificación de email ya no es requerida.
        // Los usuarios comienzan directamente como APPROVED.
        const initialStatus = UserStatus.APPROVED;

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

      // Emitir evento para enviar email de BIENVENIDA (en lugar de verificación)
      const name = (dto as any).first_name || (dto as any).company_name || 'Nuevo Usuario';
      this.eventEmitter.emit(NOTIFICATION_EVENTS.USER_REGISTERED, {
        userId,
        email: dto.email,
        name,
      } as UserRegisteredPayload);

      return userId;
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
    const isNew = !user;

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

  // =============================================
  // VERIFICACIÓN DE EMAIL
  // =============================================

  /**
   * Verifica el email del usuario usando un código OTP de 6 dígitos.
   * Al verificar exitosamente, cambia el status del usuario a APPROVED.
   */
  async verifyEmail(email: string, code: string): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.status === UserStatus.APPROVED) {
      throw new BadRequestException('La cuenta ya se encuentra verificada');
    }

    await this.otpService.verifyOtp(user.id, code, OtpType.EMAIL_VERIFICATION);

    // Determinar el status post-verificación:
    // Si el rol requiere aprobación administrativa, dejamos PENDING.
    // Si no, pasamos directamente a APPROVED.
    const roleName = user.role.name as Role;
    const requiresAdminApproval = ROLE_CATALOG[roleName]?.requiresApproval ?? false;

    if (!requiresAdminApproval) {
      await this.dataSource
        .createQueryBuilder()
        .update(User)
        .set({ status: UserStatus.APPROVED })
        .where('id = :id', { id: user.id })
        .execute();
    }

    this.logger.log(`Email verificado exitosamente para ${email}`);
  }

  // =============================================
  // RECUPERACIÓN DE CONTRASEÑA
  // =============================================

  /**
   * Solicita un restablecimiento de contraseña.
   * Emite un evento asíncrono para enviar el OTP por email.
   *
   * Por seguridad, siempre devuelve un mensaje genérico
   * sin confirmar si el email existe o no.
   */
  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(email);

    // Respuesta genérica por seguridad (no revelar si el email existe)
    if (!user) {
      this.logger.warn(`Solicitud de reset para email inexistente: ${email}`);
      return;
    }

    if (!user.is_active) {
      this.logger.warn(`Solicitud de reset para cuenta desactivada: ${email}`);
      return;
    }

    /* DESACTIVADO: La recuperación de contraseña está deshabilitada.
    this.eventEmitter.emit(NOTIFICATION_EVENTS.PASSWORD_RESET_REQUESTED, {
      userId: user.id,
      email: user.email,
    } as PasswordResetRequestedPayload);
    */
    this.logger.warn(`Solicitud de reset recibida pero ignorada (funcionalidad desactivada): ${email}`);
  }

  /**
   * Restablece la contraseña del usuario verificando el OTP.
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.is_active) {
      throw new BadRequestException('La cuenta se encuentra desactivada');
    }

    // Verificar OTP
    await this.otpService.verifyOtp(user.id, code, OtpType.PASSWORD_RESET);

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.dataSource
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where('id = :id', { id: user.id })
      .execute();

    this.logger.log(`Contraseña restablecida exitosamente para ${email}`);
  }

  // =============================================
  // REENVÍO DE OTP
  // =============================================

  /**
   * Reenvía un código OTP al email del usuario.
   * Sujeto a rate-limiting: máximo 3 solicitudes en 15 minutos.
   */
  async resendOtp(email: string, type: OtpType): Promise<void> {
    const user = await this.usersRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.is_active) {
      throw new BadRequestException('La cuenta se encuentra desactivada');
    }

    // Para reenvío de verificación de email, verificar que no esté ya verificado
    if (type === OtpType.EMAIL_VERIFICATION && user.status === UserStatus.APPROVED) {
      throw new BadRequestException('La cuenta ya se encuentra verificada');
    }

    this.eventEmitter.emit(NOTIFICATION_EVENTS.OTP_RESEND_REQUESTED, {
      userId: user.id,
      email: user.email,
      type,
    } as OtpResendRequestedPayload);
  }
}
