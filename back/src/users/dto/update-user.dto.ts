import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'La dirección no puede tener más de 150 caracteres' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres' })
  @MaxLength(2, { message: 'El país no puede tener más de 2 caracteres (ISO 3166-1)' })
  country?: string;
}
