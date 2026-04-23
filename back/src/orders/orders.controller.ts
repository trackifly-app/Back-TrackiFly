import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { AuthGuard } from "../common/guards/auth.guard";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

@Controller("orders")
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
    return this.ordersService.create(createOrderDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.ordersService.findByUser(userId);
  }

  @Get(":id")
  async findOne(@Request() req: any, @Param("id") id: string) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== req.user.id) {
      throw new ForbiddenException("No tienes permiso para ver esta orden");
    }
    return order;
  }

  @Patch(":id")
  async update(
    @Request() req: any,
    @Param("id") id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== req.user.id) {
      throw new ForbiddenException(
        "No tienes permiso para actualizar esta orden",
      );
    }
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(":id")
  async remove(@Request() req: any, @Param("id") id: string) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== req.user.id) {
      throw new ForbiddenException(
        "No tienes permiso para eliminar esta orden",
      );
    }
    return this.ordersService.remove(id);
  }

  // Endpoint temporal para pruebas: simula confirmación de pago y dispara el job
  @Post(":id/confirm-payment")
  async confirmPayment(@Request() req: any, @Param("id") id: string) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== req.user.id) {
      throw new ForbiddenException(
        "No tienes permiso para confirmar esta orden",
      );
    }
    await this.ordersService.confirmPayment(id);
    return {
      message: "Pago confirmado y job de cambio de estado programado (3 min)",
    };
  }
}
