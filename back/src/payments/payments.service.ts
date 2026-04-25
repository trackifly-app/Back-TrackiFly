import { Injectable } from "@nestjs/common";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { environment } from "../config/environment";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { Role } from "../common/enums/role.enum";
import { OrdersRepository } from "../orders/orders.repository";
import { OrdersService } from "../orders/orders.service";
import { OrderStatus } from "../common/enums/order-status.enum";

const COMPANY_DISCOUNT = 0.2;

interface WebhookBody {
  type: string;
  data?: { id: string };
}

@Injectable()
export class PaymentsService {
  private readonly mp: MercadoPagoConfig;

  constructor(
    // Necesitamos el repositorio de órdenes para crearlas y actualizarlas
    // cuando llega la confirmación del pago
    private readonly ordersRepository: OrdersRepository,
    private readonly ordersService: OrdersService,
  ) {
    this.mp = new MercadoPagoConfig({
      accessToken: environment.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(
    dto: CreatePaymentDto,
    user: { id: string; role: string },
  ) {
    // 1. Buscamos la orden que el front acaba de crear
    const order = await this.ordersRepository.findOrderById(dto.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== user.id) {
      throw new Error("Unauthorized to pay for this order");
    }

    // 2. Calculamos el precio final aplicando descuento de empresa si corresponde
    const isCompany =
      (user.role as Role) === Role.Company ||
      (user.role as Role) === Role.Operator;

    // El precio base viene de lo que guardamos en la orden
    const basePrice = order.price || 0;
    const finalAmount = isCompany
      ? basePrice * (1 - COMPANY_DISCOUNT)
      : basePrice;

    const preference = new Preference(this.mp);

    const response = await preference.create({
      body: {
        items: [
          {
            // Usamos el id de nuestra orden como id del item en MP.
            // Así cuando llega el webhook sabemos exactamente qué orden confirmar
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
        // Si el pago fue aprobado MP redirige solo sin que el usuario
        // tenga que hacer click en "volver al sitio"
        // auto_return: 'approved',  RECUERDA DESCOMENTAR PARA DEPLOY DE FRONT
        // Esta URL tiene que ser pública — Railway la expone al mundo.
        // MP la llama cada vez que el estado del pago cambia
        notification_url: `${environment.APP_URL}/api/mercadopago/webhook`,
        // Guardamos datos nuestros dentro del pago de MP.
        // Esto nos permite saber quién pagó y con qué descuento
        // sin tener que consultar nuestra DB desde el webhook
        metadata: {
          user_id: user.id,
          order_id: order.id,
          role: user.role,
          original_amount: basePrice,
          final_amount: finalAmount,
          discount_applied: isCompany,
        },
      },
    });

    // MP nos devuelve un preference_id — lo guardamos en la orden
    // para poder encontrarla cuando llegue el webhook.
    // También guardamos el monto final para tener registro de lo que se cobró
    await this.ordersRepository.update(order.id, {
      preference_id: response.id!,
      total_amount: finalAmount,
    });

    // El front necesita la checkout_url para redirigir al usuario a pagar.
    // Le mandamos también el desglose del precio para que pueda mostrárselo
    return {
      checkout_url: response.init_point,
      preference_id: response.id,
      order_id: order.id,
      original_amount: basePrice,
      final_amount: finalAmount,
      discount_applied: isCompany ? "20%" : null,
    };
  }

  async handleWebhook(body: WebhookBody) {
    if (body.type !== "payment") return { received: true };

    const paymentId = body.data?.id;
    if (!paymentId) return { received: true };

    const paymentClient = new Payment(this.mp);

    // Casteamos la respuesta porque el SDK de MP no exporta
    // todos sus tipos correctamente — preference_id y status
    // existen en runtime pero TypeScript no los ve sin el casteo
    const payment = (await paymentClient.get({ id: paymentId })) as {
      preference_id?: string;
      status?: string;
    };

    const preferenceId = payment.preference_id;
    const status = payment.status;

    if (!preferenceId) return { received: true };

    const order =
      await this.ordersRepository.findOrderByPreferenceId(preferenceId);
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
