import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { MeasurementUnit } from "../../common/enums/measurement-unit.enum";

export class UpdateOrderDetailDto {
  @IsOptional()
  @IsString()
  readonly product?: string;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;

  @IsOptional()
  @IsNumber()
  readonly unitPrice?: number;

  @IsOptional()
  @IsNumber()
  readonly orderId?: number;

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
