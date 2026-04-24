import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CompanyPlan } from '../../common/enums/company-plan.enum';

export class CreateCompanyDto {
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

  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La dirección no puede tener más de 255 caracteres' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @MinLength(7, { message: 'El teléfono debe tener al menos 7 caracteres' })
  @MaxLength(15, { message: 'El teléfono no puede tener más de 15 caracteres' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'El país debe ser una cadena de texto' })
  @MinLength(2, { message: 'El país debe tener 2 caracteres (código ISO)' })
  @MaxLength(2, { message: 'El país debe tener 2 caracteres (código ISO)' })
  country?: string;

  @IsOptional()
  @IsEnum(CompanyPlan, { message: 'El plan debe ser un valor válido' })
  plan?: CompanyPlan;
}
