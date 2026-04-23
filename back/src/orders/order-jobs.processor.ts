import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Job } from "bullmq";
import { OrdersService } from "./orders.service";
import { OrderStatus } from "../common/enums/order-status.enum";
import { Queue } from "bullmq";

const STATUS_SEQUENCE = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Completed,
];

@Processor("order-status")
export class OrderJobsProcessor {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectQueue("order-status") private readonly orderStatusQueue: Queue,
  ) {}

  @Process()
  async handleOrderStatus(job: Job) {
    const { orderId, currentStatusIndex } = job.data;
    const nextStatusIndex = currentStatusIndex + 1;
    if (nextStatusIndex < STATUS_SEQUENCE.length) {
      const nextStatus = STATUS_SEQUENCE[nextStatusIndex];
      await this.ordersService.updateStatus(orderId, nextStatus);

      // Usa la cola inyectada para re-agendar el siguiente cambio de estado
      await this.orderStatusQueue.add(
        "order-status",
        { orderId, currentStatusIndex: nextStatusIndex },
        { delay: 3 * 60 * 1000 }, // 3 minutos
      );
    }
    // Si ya es el último estado, no hace nada más
  }
}
