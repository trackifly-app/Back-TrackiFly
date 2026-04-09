// DTO para la creación de usuarios. Define y valida los datos que se pueden recibir al crear un usuario.
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';

/**
 * Define los campos requeridos y opcionales para crear un usuario.
 * Usa class-validator para asegurar la validez de los datos recibidos.
 */
export class CreateUserDto {
  /** Nombre completo del usuario */
  @IsString()
  @Length(1, 100)
  nombre: string;

  @IsOptional()
  /** UUID del rol asociado al usuario */
  @IsUUID()
  id_rol: string;

  @IsOptional()
  /** UUID de la forma de pago asociada */
  @IsUUID()
  id_forma_de_pago: string;

  /** Correo electrónico del usuario */
  @IsEmail()
  correo: string;

  /** Contraseña del usuario (mínimo 6 caracteres) */
  @IsString()
  @MinLength(6)
  password: string;

  /** Teléfono del usuario (opcional) */
  @IsOptional()
  @IsString()
  @Length(0, 20)
  telefono?: string;

  /** URL de la imagen de perfil (opcional) */
  @IsOptional()
  @IsString()
  imagen?: string;

  /** Fecha de nacimiento (opcional, formato ISO) */
  @IsOptional()
  @IsDateString()
  fecha_de_nacimiento?: string;

  /** Estado del usuario (ej: activo, inactivo) */
  @IsString()
  @Length(1, 50)
  estado: string;

  /** Si el usuario acepta notificaciones (opcional) */
  @IsOptional()
  @IsBoolean()
  notificaciones?: boolean;

  /** Si la cuenta está activa (opcional) */
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  /** Fecha de la última sesión (opcional) */
  @IsOptional()
  @IsDateString()
  ultima_sesion?: Date;

  /** Fecha del último login (opcional) */
  @IsOptional()
  @IsDateString()
  ultimo_login?: Date;

  /** Fecha del último login (opcional, redundante) */
  @IsOptional()
  @IsDateString()
  ultimo_login_fecha?: Date;

  /** Estado de la cuenta (ej: verificada, suspendida) */
  @IsString()
  @Length(1, 50)
  estado_de_la_cuenta: string;

  /** Si el email está verificado (opcional) */
  @IsOptional()
  @IsBoolean()
  verificacion_email?: boolean;
}
