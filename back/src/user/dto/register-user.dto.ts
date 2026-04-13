import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/gender.enum';

export class RegisterUserDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener almenos 3 caracteres' })
  @MaxLength(80, { message: 'E nombre no puede tener más de 80 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener una estructura válida' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, {
    message: 'La contraseña no puede tener más de 100 caracteres',
  })
  password: string;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(150, {
    message: 'La dirección no puede tener más de 150 caracteres',
  })
  address: string;

  @IsNotEmpty({ message: 'El numero de telefono no puede estar vacío' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Telefono debe ser un numero' },
  )
  @Min(1000000, { message: 'El teléfono debe tener al menos 7 dígitos' })
  @Max(99999999999999, {
    message: 'El teléfono no puede superar los 14 dígitos',
  })
  phone: number;

  @IsNotEmpty({ message: 'El género no puede estar vacío' })
  @IsEnum(Gender, { message: 'El género debe ser un valor válido' })
  gender: Gender;

  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacía' })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener formato ISO' },
  )
  birthdate: string;

  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres' })
  @MaxLength(80, { message: 'El país no puede tener más de 80 caracteres' })
  country: string;

  @IsOptional()
  @IsUUID('4', { message: 'El rol debe ser un UUID válido' })
  roleId: string;
}
