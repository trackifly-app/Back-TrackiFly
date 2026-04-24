import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { OrderStatus } from "../common/enums/order-status.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersRepository } from "./orders.repository";

const STATUS_SEQUENCE = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Completed,
];

@Injectable()
export class OrdersService {
  private ordersAwaitingStatusChange: Map<string, number> = new Map();

  constructor(private readonly ordersRepository: OrdersRepository) {}

  /**
   * Llama este método cuando el pago de la orden se confirme.
   * Marca la orden para cambio automático de estado.
   */
  async confirmPayment(orderId: string) {
    // Cambia el estado inicial a "pending"
    await this.updateStatus(orderId, OrderStatus.Pending);

    // Marca la orden para cambio automático (índice 0 = pending)
    this.ordersAwaitingStatusChange.set(orderId, 0);
  }

  /**
   * Task programada cada 3 minutos para cambiar estados automáticamente
   */
  @Cron("*/3 * * * *")
  async handleOrderStatusChange() {
    const ordersToProcess = Array.from(
      this.ordersAwaitingStatusChange.entries(),
    );

    for (const [orderId, currentStatusIndex] of ordersToProcess) {
      const nextStatusIndex = currentStatusIndex + 1;

      if (nextStatusIndex < STATUS_SEQUENCE.length) {
        const nextStatus = STATUS_SEQUENCE[nextStatusIndex];
        await this.updateStatus(orderId, nextStatus);

        // Actualizar el índice
        this.ordersAwaitingStatusChange.set(orderId, nextStatusIndex);
      } else {
        // Orden completada, remover del mapa
        this.ordersAwaitingStatusChange.delete(orderId);
      }
    }
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
