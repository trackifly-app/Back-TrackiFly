import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bullmq";
import { OrderStatus } from "../common/enums/order-status.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersRepository } from "./orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @InjectQueue("order-status") private readonly orderStatusQueue: Queue,
  ) {}
  /**
   * Llama este método cuando el pago de la orden se confirme.
   * Dispara el job para el cambio de estado automático.
   */
  async confirmPayment(orderId: string) {
    // Cambia el estado inicial a "pending"
    await this.updateStatus(orderId, OrderStatus.Pending);

    // Crea el primer job para el cambio de estado
    await this.orderStatusQueue.add(
      "order-status",
      { orderId, currentStatusIndex: 0 },
      { delay: 3 * 60 * 1000 }, // 3 minutos para pruebas
    );
  }

  /**
   * Actualiza el estado de la orden
   */
  async updateStatus(orderId: string, status: OrderStatus) {
    return this.ordersRepository.updateOrder(orderId, { status });
  }

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<any> {
    return await this.ordersRepository.createOrder(createOrderDto, userId);
  }

  async findAll(): Promise<any[]> {
    return await this.ordersRepository.findAllOrders();
  }

  async findByUser(userId: string): Promise<any[]> {
    return await this.ordersRepository.findOrdersByUser(userId);
  }

  async findOne(id: string): Promise<any> {
    const order = await this.ordersRepository.findOrderById(id);
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<any> {
    const order = await this.ordersRepository.updateOrder(id, updateOrderDto);
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }

  async remove(id: string): Promise<void> {
    const removed = await this.ordersRepository.removeOrder(id);
    if (!removed) throw new NotFoundException("Order not found");
  }
}
