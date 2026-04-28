import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OtpType } from '../enums/otp-type.enum';

/**
 * DTO para solicitar el reenvío de un código OTP.
 */
export class ResendOtpDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario registrado',
    example: 'usuario@ejemplo.com',
  })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;

  @ApiProperty({
    description: 'Tipo de OTP a reenviar',
    enum: OtpType,
    example: OtpType.EMAIL_VERIFICATION,
  })
  @IsNotEmpty({ message: 'El tipo de OTP es obligatorio' })
  @IsEnum(OtpType, {
    message: `El tipo de OTP debe ser uno de: ${Object.values(OtpType).join(', ')}`,
  })
  type: OtpType;
}
