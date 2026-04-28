import { Injectable, NotFoundException, ForbiddenException, Inject, forwardRef } from "@nestjs/common";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { environment } from "../config/environment";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Role } from "../common/enums/role.enum";
import { OrdersRepository } from "../orders/orders.repository";
import { OrdersService } from "../orders/orders.service";
import { OrderStatus } from "../common/enums/order-status.enum";
import { UsersRepository } from "../users/users.repository";


interface WebhookBody {
  type: string;
  data?: { id: string };
}

@Injectable()
export class PaymentsService {
  private readonly mp: MercadoPagoConfig;

  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
    private readonly usersRepository: UsersRepository,
  ) {
    this.mp = new MercadoPagoConfig({
      accessToken: environment.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(dto: CreatePaymentDto) {
    // 1. Buscamos el usuario por el ID enviado en el DTO
    const user = await this.usersRepository.getUserById(dto.userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 2. Buscamos la orden
    const order = await this.ordersRepository.findOrderById(dto.orderId);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    // Verificamos que la orden pertenezca al usuario que intenta pagar
    if (order.userId !== dto.userId) {
      throw new ForbiddenException("Unauthorized to pay for this order");
    }

    // 3. Calculamos el precio final aplicando descuento de empresa si corresponde
    // Nota: Accedemos a user.role.name porque en tu UserEntity role es una relación
    const userRole = user.role.name;
    const isCompany =
      userRole === Role.Company ||
      userRole === Role.Operator;

    const basePrice = Number(order.price) || 0;
    const finalAmount = Number(basePrice);

    const preference = new Preference(this.mp);

    const response = await preference.create({
      body: {
        items: [
          {
            id: order.id,
            title: "Envío Trackifly",
            quantity: 1,
            unit_price: finalAmount,
            currency_id: "ARS",
          },
        ],
        back_urls: {
          success: `${environment.FRONTEND_URL}/payment/success`,
          failure: `${environment.FRONTEND_URL}/payment/failure`,
          pending: `${environment.FRONTEND_URL}/payment/pending`,
        },
        notification_url: `${environment.APP_URL}/mercadopago/webhook`,
        metadata: {
          user_id: user.id,
          order_id: order.id,
          role: userRole,
          original_amount: basePrice,
          final_amount: finalAmount,
          discount_applied: isCompany,
        },
      },
    });

    await this.ordersRepository.update(order.id, {
      preference_id: response.id!,
    });

    return {
      checkout_url: response.init_point,
      preference_id: response.id,
      order_id: order.id,
      original_amount: basePrice,
      final_amount: finalAmount,
      discount_applied: isCompany ? "20%" : null,
    };
  }

  async   handleWebhook(body: WebhookBody) {
    if (body.type !== "payment") return { received: true };

    const paymentId = body.data?.id;
    if (!paymentId) return { received: true };

    const paymentClient = new Payment(this.mp);
    const payment = (await paymentClient.get({ id: paymentId })) as {
      preference_id?: string;
      status?: string;
    };

    console.log('Respuesta completa de MP:', JSON.stringify(payment, null, 2))
    const preferenceId = payment.preference_id;
    const status = payment.status;


     console.log('Preference ID recibido:', preferenceId);
  console.log('Status del pago:', status);

    if (!preferenceId) return { received: true };

    const order =
      await this.ordersRepository.findOrderByPreferenceId(preferenceId);
       console.log('Orden encontrada:', order);
    if (!order) return { received: true };

    if (status === "approved") {
      await this.ordersService.confirmPayment(order.id);
      console.log(`Orden ${order.id} pagada — lista para procesar en cron job`);
    } else if (status === "rejected") {
      await this.ordersRepository.updateOrderStatus(
        order.id,
        OrderStatus.Cancelled,
      );
      console.log(`Pago rechazado para la orden ${order.id}`);
    }

    return { received: true };
  }
}
