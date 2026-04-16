import { IsString, IsInt, Min } from "class-validator";

export class CreateOrderDto {
  @IsString()
  product: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
