import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { MeasurementUnit } from "../../common/enums/measurement-unit.enum";

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsString()
  readonly product: string;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsNotEmpty()
  @IsNumber()
  readonly unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  readonly orderId: number;

  // Detalles del artículo
  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  // Propiedades físicas del paquete
  @IsOptional()
  @IsNumber()
  readonly weight?: number;

  @IsOptional()
  @IsNumber()
  readonly height?: number;

  @IsOptional()
  @IsNumber()
  readonly width?: number;

  @IsOptional()
  @IsNumber()
  readonly depth?: number;

  @IsOptional()
  @IsEnum(MeasurementUnit)
  readonly unit?: MeasurementUnit;

  // Servicios adicionales (banderas)
  @IsOptional()
  @IsBoolean()
  readonly fragile?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly dangerous?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly cooled?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly urgent?: boolean;
}
