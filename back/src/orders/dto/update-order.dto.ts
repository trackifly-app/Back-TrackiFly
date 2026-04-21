import { IsOptional, IsString, IsNumber, IsEnum } from "class-validator";
import { OrderStatus } from "../../common/enums/order-status.enum";

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  readonly product?: string;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  readonly status?: OrderStatus;

  @IsOptional()
  @IsString()
  readonly pickup_direction?: string;

  @IsOptional()
  @IsString()
  readonly delivery_direction?: string;
}
