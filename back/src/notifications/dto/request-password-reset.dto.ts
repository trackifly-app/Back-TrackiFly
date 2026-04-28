import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para solicitar un restablecimiento de contraseña.
 * Se envía un código OTP al email proporcionado.
 */
export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Correo electrónico de la cuenta a recuperar',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El email es obligatorio para solicitar el restablecimiento' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;
}
