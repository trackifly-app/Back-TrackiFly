import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RegisterBaseDto } from './register-base.dto';

// para que le asignen el descuento de usuario empresa
// pueden ellos traerse uno igual o puedo dejar uno dos, lo deje asi para que tenga sentido, aparte adelante le mande plan:
export enum CompanyPlan {
  FREE = 'free',
  BASIC = 'basic',
  PRO = 'pro',
}

export class RegisterCompanyDto extends RegisterBaseDto {
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

  @IsNotEmpty({ message: 'El plan no puede estar vacío' })
  @IsEnum(CompanyPlan, { message: 'El plan debe ser un valor válido' })
  plan: CompanyPlan;

  @IsOptional()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  image?: string;
}