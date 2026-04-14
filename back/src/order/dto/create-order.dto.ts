import { IsNotEmpty, IsString, IsUUID, IsUrl, MaxLength, MinLength } from 'class-validator';
import { QuoteOrderDto } from './quote-order.dto';

export class CreateOrderDto extends QuoteOrderDto {
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
}