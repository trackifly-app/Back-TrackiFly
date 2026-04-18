import { RegisterBaseDto } from './register-base.dto';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterOperatorDto extends RegisterBaseDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre no puede tener más de 80 caracteres' })
  first_name: string;

  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El apellido no puede tener más de 80 caracteres' })
  last_name: string;

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'La dirección no puede tener más de 150 caracteres' })
  address: string;

  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  phone: string;

  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres' })
  @MaxLength(2, { message: 'El país no puede tener más de 2 caracteres (ISO 3166-1)' })
  country: string;
}
