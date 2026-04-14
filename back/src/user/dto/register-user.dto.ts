import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/gender.enum';
import { RegisterBaseDto } from './register-base.dto'

export class RegisterUserDto extends RegisterBaseDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre debe tener almenos 3 caracteres' })
  @MaxLength(80, { message: 'E nombre no puede tener más de 80 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El género no puede estar vacío' })
  @IsEnum(Gender, { message: 'El género debe ser un valor válido' })
  gender: Gender;

  @IsNotEmpty({ message: 'La fecha de nacimiento no puede estar vacía' })
  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe tener formato ISO' },
  )
  birthdate: string;
}
