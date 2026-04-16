import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  readonly product?: string;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;
}
