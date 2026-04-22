import { PartialType } from "@nestjs/swagger";
import { CreateOrderDto } from "./create-order.dto";
import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus } from "../../common/enums/order-status.enum";

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'El estado debe ser un valor válido (pending, processing, completed, cancelled)' })
  status?: OrderStatus;
}
