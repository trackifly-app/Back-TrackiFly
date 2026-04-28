import { Injectable, NotFoundException, Inject, forwardRef } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { OrderStatus } from "../common/enums/order-status.enum";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrdersRepository } from "./orders.repository";
import { PaymentsService } from "../payments/payments.service";

const STATUS_SEQUENCE = [
  OrderStatus.Paid,
  OrderStatus.Processing,
  OrderStatus.Shipped,
  OrderStatus.Completed,
];

@Injectable()
export class OrdersService {
  private ordersAwaitingStatusChange: Map<string, number> = new Map();

  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(forwardRef(() => PaymentsService)) private readonly payments: PaymentsService
  ) {}

  async confirmPayment(orderId: string) {

    this.ordersAwaitingStatusChange.set(orderId, 0);
  }

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
    const order = await this.ordersRepository.createOrder(createOrderDto, userId);

    try {
      const paymentResponse = await this.payments.createPreference({
        orderId: order.id,
        userId: userId,
      });

      return {
        ...order,
        paymentUrl: paymentResponse.checkout_url,
        preferenceId: paymentResponse.preference_id,
      };
    } catch (error) {
      console.error("Error creating Mercado Pago preference:", error);
      return {
        ...order,
        paymentError: "No se pudo generar el link de pago en este momento",
      };
    }
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

  async findByTrackingCode(code: string): Promise<any> {
    const order = await this.ordersRepository.findOrderByTrackingCode(code);
    if (!order) throw new NotFoundException("Order with this tracking code not found");
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

  /**
   * Crea múltiples órdenes para una company en una sola operación
   * 
   * @param createBulkOrderDto - DTO con companyId y array de órdenes
   * @returns Resultado con órdenes exitosas y errores
   */
  async createBulkOrders(
    createBulkOrderDto: CreateBulkOrderDto,
  ): Promise<BulkOrdersResult> {
    const { companyId, orders, continueOnError } = createBulkOrderDto;

    // Aquí iría la lógica para obtener el userId de la company
    // Por ahora, asumimos que el companyId es válido
    // En una implementación real, validarías la company y obtendrías su userId
    
    // TODO: Integrar con CompaniesService para obtener userId de company
    // const company = await this.companiesService.getCompanyById(companyId);
    // if (!company) throw new NotFoundException(`Company con id '${companyId}' no existe`);
    // const userId = company.user.id;

    // Placeholder: usar companyId como userId (en producción, obtener del service)
    const userId = companyId;

    console.log(`[BULK_ORDERS] Iniciando creación de ${orders.length} órdenes para company: ${companyId}`);

    const result = await this.ordersRepository.createBulkOrders(
      orders,
      userId,
      continueOnError,
    );

    result.companyId = companyId;

    console.log(
      `[BULK_ORDERS] Resultado: ${result.successCount}/${result.totalRequested} exitosas en ${result.duration}ms`,
    );

    return result;
  }
}
