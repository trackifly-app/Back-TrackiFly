import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para verificar un código OTP (registro o recuperación).
 */
export class VerifyOtpDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario registrado',
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
}
