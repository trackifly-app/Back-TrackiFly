import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// para que le asignen el descuento de usuario empresa
// pueden ellos traerse uno igual o puedo dejar uno dos, lo deje asi para que tenga sentido, aparte adelante le mande plan:
export enum CompanyPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
}

export class RegisterCompanyDto {
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail({}, { message: 'El email debe tener una estructura válida' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(100, { message: 'La contraseña no puede tener más de 100 caracteres' })
  password: string;

  @IsNotEmpty({ message: 'El nombre de la empresa no puede estar vacío' })
  @IsString({ message: 'El nombre de la empresa debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre de la empresa debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre de la empresa no puede tener más de 100 caracteres' })
  company_name: string;

  @IsNotEmpty({ message: 'La industria no puede estar vacía' })
  @IsString({ message: 'La industria debe ser una cadena de texto' })
  @MaxLength(50, { message: 'La industria no puede tener más de 50 caracteres' })
  industry: string;

  @IsNotEmpty({ message: 'El nombre de contacto no puede estar vacío' })
  @IsString({ message: 'El nombre de contacto debe ser una cadena de texto' })
  @MinLength(3, { message: 'El nombre de contacto debe tener al menos 3 caracteres' })
  @MaxLength(80, { message: 'El nombre de contacto no puede tener más de 80 caracteres' })
  contact_name: string;

  @IsNotEmpty({ message: 'El teléfono no puede estar vacío' })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  // es mas seguro como string, pero decime sino y lo cambio
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  phone: string; 

  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MinLength(3, { message: 'La dirección debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'La dirección no puede tener más de 150 caracteres' })
  address: string;

  @IsNotEmpty({ message: 'El país no puede estar vacío' })
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener al menos 2 caracteres (ISO 3166-1)' })
  @MaxLength(2, { message: 'El país no puede tener más de 2 caracteres (ISO 3166-1)' })
  country: string;

  @IsNotEmpty({ message: 'El plan no puede estar vacío' })
  @IsEnum(CompanyPlan, { message: 'El plan debe ser un valor válido' })
  plan: CompanyPlan;
}