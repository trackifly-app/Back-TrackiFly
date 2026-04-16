import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { OrderDetailsService } from "./order-details.service";
import { CreateOrderDetailDto } from "./dto/create-order-detail.dto";
import { UpdateOrderDetailDto } from "./dto/update-order-detail.dto";

@Controller("order-details")
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailsService) {}

  @Post()
  create(@Body() createDto: CreateOrderDetailDto) {
    return this.orderDetailsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.orderDetailsService.findAll();
  }

  @Get("order/:orderId")
  findByOrder(@Param("orderId") orderId: string) {
    return this.orderDetailsService.findByOrder(+orderId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.orderDetailsService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateDto: UpdateOrderDetailDto) {
    return this.orderDetailsService.update(+id, updateDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.orderDetailsService.remove(+id);
  }
}
