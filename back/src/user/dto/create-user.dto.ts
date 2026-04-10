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
  IsEmpty,
  IsNotEmpty,
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

 //@IsEmpty()
  /** UUID del rol asociado al usuario */
  @IsUUID()
  id_rol: string;

  //@IsNotEmpty()
  @IsOptional()
  /** UUID de la forma de pago asociada */
  @IsUUID()
  id_forma_de_pago: string;

  //@IsNotEmpty()
  /** Correo electrónico del usuario */
  @IsEmail()
  correo: string;

  //@IsNotEmpty()
  /** Contraseña del usuario (mínimo 6 caracteres) */
  @IsString()
  @MinLength(6)
  password: string;

  /** Teléfono del usuario (opcional) */
  //@IsNotEmpty()
  @IsString()
  @Length(0, 20)
  telefono?: string;

  /** URL de la imagen de perfil (opcional) */
  @IsOptional()
  @IsString()
  imagen?: string;

  /** Fecha de nacimiento (opcional, formato ISO) */
  //@IsNotEmpty()
  @IsDateString()
  fecha_de_nacimiento?: string;


  /** Si el usuario acepta notificaciones (opcional) */
  @IsOptional()
  @IsBoolean()
  notificaciones?: boolean;

  /** Si la cuenta está activa (opcional) */
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  /** Fecha de la última sesión (opcional) */
 // @IsOptional()
 // @IsDateString()
 // ultima_sesion?: Date;


  /** Estado de la cuenta (ej: verificada, suspendida) */
 // @IsString()
 // @Length(1, 50)
 // estado_de_la_cuenta: string;

  ///** Si el email está verificado (opcional) */
  //@IsOptional()
  //@IsBoolean()
  //verificacion_email?: boolean;
}
