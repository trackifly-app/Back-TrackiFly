import { IsOptional, IsString, IsNumber } from 'class-validator';

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
}
