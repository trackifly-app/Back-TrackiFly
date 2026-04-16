import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/enums/gender.enum';

export class CreateProfileDto {
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

  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacía' })
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener formato ISO' })
  birthdate: string;

  @IsNotEmpty({ message: 'El género no puede estar vacío' })
  @IsEnum(Gender, { message: 'El género debe ser un valor válido' })
  gender: Gender;
}
