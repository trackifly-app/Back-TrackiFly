import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterBaseDto {
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener una estructura válida' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  password: string;
}
