import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsUUID, 
  Min, 
  IsNotEmpty, 
  MaxLength, 
  IsUrl 
} from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El ID de categoría es requerido' })
  @IsUUID('4', { message: 'El ID de categoría debe ser un UUID válido' })
  category_id: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  image?: string;

  @IsNotEmpty({ message: 'La dirección de retiro es requerida' })
  @IsString({ message: 'La dirección de retiro debe ser texto' })
  @MaxLength(255, { message: 'La dirección de retiro es demasiado larga' })
  pickup_direction: string;

  @IsNotEmpty({ message: 'La dirección de entrega es requerida' })
  @IsString({ message: 'La dirección de entrega debe ser texto' })
  @MaxLength(255, { message: 'La dirección de entrega es demasiado larga' })
  delivery_direction: string;

  @IsNotEmpty({ message: 'El alto es requerido' })
  @IsNumber({}, { message: 'El alto debe ser un número' })
  @Min(0, { message: 'El alto no puede ser negativo' })
  height: number;

  @IsNotEmpty({ message: 'El ancho es requerido' })
  @IsNumber({}, { message: 'El ancho debe ser un número' })
  @Min(0, { message: 'El ancho no puede ser negativo' })
  width: number;

  @IsNotEmpty({ message: 'La profundidad es requerida' })
  @IsNumber({}, { message: 'La profundidad debe ser un número' })
  @Min(0, { message: 'La profundidad no puede ser negativo' })
  depth: number;

  @IsNotEmpty({ message: 'El peso es requerido' })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(0, { message: 'El peso no puede ser negativo' })
  weight: number;

  @IsNotEmpty({ message: 'Debes indicar si es frágil' })
  @IsBoolean({ message: 'El campo frágil debe ser un booleano' })
  fragile: boolean;

  @IsNotEmpty({ message: 'Debes indicar si requiere refrigeración' })
  @IsBoolean({ message: 'El campo refrigeración debe ser un booleano' })
  cooled: boolean;

  @IsNotEmpty({ message: 'Debes indicar si es material peligroso' })
  @IsBoolean({ message: 'El campo material peligroso debe ser un booleano' })
  dangerous: boolean;

  @IsNotEmpty({ message: 'Debes indicar si es urgente' })
  @IsBoolean({ message: 'El campo urgente debe ser un booleano' })
  urgent: boolean;

  @IsNotEmpty({ message: 'La unidad de medida es requerida' })
  @IsString({ message: 'La unidad de medida debe ser texto' })
  @MaxLength(10, { message: 'La unidad es demasiado larga' })
  unit: string;

  @IsNotEmpty({ message: 'La distancia es requerida' })
  @IsNumber({}, { message: 'La distancia debe ser un número' })
  @Min(0, { message: 'La distancia no puede ser negativa' })
  distance: number;
}
