import { 
  IsNumber, IsPositive, IsString, 
  IsOptional, IsBoolean, IsUUID 
} from 'class-validator';

export class CreatePaymentDto {
  // El monto lo calcula el front basándose en distancia, peso, etc.
  // El back después aplica el descuento si el usuario es empresa
  @IsNumber()
  @IsPositive()
  amount: number;

  // De dónde sale el paquete y a dónde va
  @IsString()
  pickup_direction: string;

  @IsString()
  delivery_direction: string;

  // La distancia entre los dos puntos — la usa el front para calcular el precio
  @IsNumber()
  distance: number;

  // Datos del paquete que se va a enviar
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsNumber()
  width: number;

  @IsNumber()
  depth: number;

  // La unidad de medida de las dimensiones (cm, m, etc.)
  @IsString()
  unit: string;

  // Estas cuatro flags determinan cómo se maneja el paquete
  @IsBoolean()
  fragile: boolean;

  @IsBoolean()
  dangerous: boolean;

  @IsBoolean()
  cooled: boolean;    // requiere cadena de frío

  @IsBoolean()
  urgent: boolean;    // entrega prioritaria

  // La categoría del paquete es opcional porque no siempre aplica
  @IsUUID()
  @IsOptional()
  category_id?: string;
}