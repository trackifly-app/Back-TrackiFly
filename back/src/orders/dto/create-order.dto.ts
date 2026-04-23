import { IsString, IsInt, Min, IsOptional } from "class-validator";

export class CreateOrderDto {
  @IsString()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  pickup_direction?: string;

  @IsOptional()
  @IsString()
  delivery_direction?: string;
}
