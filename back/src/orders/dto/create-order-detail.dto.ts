import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
}
