import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DimensionUnit {
  CM = 'cm',
  IN = 'in',
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede tener más de 500 caracteres' })
  description: string;

  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  @IsUUID('4', { message: 'La categoría debe ser un UUID válido' })
  category_id: string;

  @IsNotEmpty({ message: 'La imagen es obligatoria' })
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  image: string;

  @IsNotEmpty({ message: 'El peso es obligatorio' })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @IsPositive({ message: 'El peso debe ser positivo' })
  @Type(() => Number)
  weight: number;

  @IsNotEmpty({ message: 'La altura es obligatoria' })
  @IsNumber({}, { message: 'La altura debe ser un número' })
  @IsPositive({ message: 'La altura debe ser positiva' })
  @Type(() => Number)
  height: number;

  @IsNotEmpty({ message: 'El ancho es obligatorio' })
  @IsNumber({}, { message: 'El ancho debe ser un número' })
  @IsPositive({ message: 'El ancho debe ser positivo' })
  @Type(() => Number)
  width: number;

  @IsNotEmpty({ message: 'La profundidad es obligatoria' })
  @IsNumber({}, { message: 'La profundidad debe ser un número' })
  @IsPositive({ message: 'La profundidad debe ser positiva' })
  @Type(() => Number)
  depth: number;

  @IsNotEmpty({ message: 'La unidad es obligatoria' })
  @IsEnum(DimensionUnit, { message: 'La unidad debe ser cm o in' })
  unit: DimensionUnit;

  @IsNotEmpty({ message: 'La dirección de origen es obligatoria' })
  @IsString()
  pickup_direction: string;

  @IsNotEmpty({ message: 'La dirección de destino es obligatoria' })
  @IsString()
  delivery_direction: string;

  @IsOptional()
  @IsBoolean()
  fragile?: boolean;

  @IsOptional()
  @IsBoolean()
  dangerous?: boolean;

  @IsOptional()
  @IsBoolean()
  cooled?: boolean;

  @IsOptional()
  @IsBoolean()
  urgent?: boolean;
}