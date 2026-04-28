import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para restablecer la contraseña con un código OTP.
 */
export class ResetPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico de la cuenta a recuperar',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;

  @ApiProperty({
    description: 'Código OTP de 6 dígitos recibido por email',
    example: '482910',
    minLength: 6,
    maxLength: 6,
  })
  @IsNotEmpty({ message: 'El código OTP es obligatorio' })
  @IsString({ message: 'El código OTP debe ser una cadena de texto' })
  @Length(6, 6, { message: 'El código OTP debe tener exactamente 6 dígitos' })
  @Matches(/^\d{6}$/, {
    message: 'El código OTP debe contener solo números',
  })
  code: string;

  @ApiProperty({
    description: 'Nueva contraseña. Mínimo 8 caracteres, debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial',
    example: 'NuevaPass123!',
    minLength: 8,
    maxLength: 128,
  })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(128, { message: 'La contraseña no puede exceder 128 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
    {
      message:
        'La contraseña debe incluir al menos: una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)',
    },
  )
  newPassword: string;
}
