import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  ForbiddenException,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, createOrderDto.userId);
  }

  @Get()
  findAll(@Query("userId") userId: string) {
    if (!userId) {
      throw new ForbiddenException("userId es requerido como query parameter");
    }
    return this.ordersService.findByUser(userId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query("userId") userId: string) {
    if (!userId) {
      throw new ForbiddenException("userId es requerido como query parameter");
    }
    const order = await this.ordersService.findOne(id);
    if (order.userId !== userId) {
      throw new ForbiddenException("No tienes permiso para ver esta orden");
    }
    return order;
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== updateOrderDto.userId) {
      throw new ForbiddenException(
        "No tienes permiso para actualizar esta orden",
      );
    }
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Query("userId") userId: string) {
    if (!userId) {
      throw new ForbiddenException("userId es requerido como query parameter");
    }
    const order = await this.ordersService.findOne(id);
    if (order.userId !== userId) {
      throw new ForbiddenException(
        "No tienes permiso para eliminar esta orden",
      );
    }
    return this.ordersService.remove(id);
  }

  @Post(":id/confirm-payment")
  async confirmPayment(
    @Param("id") id: string,
    @Query("userId") userId: string,
  ) {
    if (!userId) {
      throw new ForbiddenException("userId es requerido como query parameter");
    }
    const order = await this.ordersService.findOne(id);
    if (order.userId !== userId) {
      throw new ForbiddenException(
        "No tienes permiso para confirmar esta orden",
      );
    }
    await this.ordersService.confirmPayment(id);
    return {
      message: "Pago confirmado, cambio de estado programado en 3 minutos",
    };
  }
}
