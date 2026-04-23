import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { environment } from '../config/environment';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Role } from '../common/enums/role.enum';
import { OrdersRepository } from '../orders/orders.repository';
import { OrderStatus } from '../common/enums/order-status.enum';

const COMPANY_DISCOUNT = 0.20;

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
  ) {
    this.mp = new MercadoPagoConfig({
      accessToken: environment.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(
    dto: CreatePaymentDto,
    user: { id: string; role: string }
  ) {
    // Tanto empresas como sus operadores tienen descuento preferencial.
    // Un operador trabaja para una empresa, así que tiene sentido
    // que también pague el precio de empresa
    const isCompany =
      (user.role as Role) === Role.Company ||
      (user.role as Role) === Role.Operator;

    const finalAmount = isCompany
      ? dto.amount * (1 - COMPANY_DISCOUNT)
      : dto.amount;

    // Creamos la orden ANTES de ir a MercadoPago.
    // ¿Por qué? Porque si MP falla después, ya tenemos registro
    // de que el usuario intentó pagar. La orden nace en Pending
    // y cambia a Paid solo cuando MP confirma el cobro
    const order = await this.ordersRepository.createOrder(
      {
        pickup_direction: dto.pickup_direction,
        delivery_direction: dto.delivery_direction,
        distance: dto.distance,
        name: dto.name,
        description: dto.description,
        weight: dto.weight,
        height: dto.height,
        width: dto.width,
        depth: dto.depth,
        unit: dto.unit,
        fragile: dto.fragile,
        dangerous: dto.dangerous,
        cooled: dto.cooled,
        urgent: dto.urgent,
        category_id: dto.category_id as string,
      },
      user.id,
    );

    const preference = new Preference(this.mp);

    const response = await preference.create({
      body: {
        items: [
          {
            // Usamos el id de nuestra orden como id del item en MP.
            // Así cuando llega el webhook sabemos exactamente qué orden confirmar
            id: order.id,
            title: 'Envío Trackifly',
            quantity: 1,
            unit_price: finalAmount,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${environment.FRONTEND_URL}/payment/success`,
          failure: `${environment.FRONTEND_URL}/payment/failure`,
          pending: `${environment.FRONTEND_URL}/payment/pending`,
        },
        // Si el pago fue aprobado MP redirige solo sin que el usuario
        // tenga que hacer click en "volver al sitio"
        auto_return: 'approved',
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
          original_amount: dto.amount,
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
      original_amount: dto.amount,
      final_amount: finalAmount,
      discount_applied: isCompany ? '20%' : null,
    };
  }

async handleWebhook(body: WebhookBody) {
    if (body.type !== 'payment') return { received: true };

    const paymentId = body.data?.id;
    if (!paymentId) return { received: true };

    const paymentClient = new Payment(this.mp);
    
    // Casteamos la respuesta porque el SDK de MP no exporta
    // todos sus tipos correctamente — preference_id y status
    // existen en runtime pero TypeScript no los ve sin el casteo
    const payment = await paymentClient.get({ id: paymentId }) as {
      preference_id?: string;
      status?: string;
    };

    const preferenceId = payment.preference_id;
    const status = payment.status;

    if (!preferenceId) return { received: true };

    const order = await this.ordersRepository.findOrderByPreferenceId(preferenceId);
    if (!order) return { received: true };

    if (status === 'approved') {
      await this.ordersRepository.updateOrderStatus(order.id, OrderStatus.Paid);
      console.log(`Orden ${order.id} pagada — lista para procesar`);
    } else if (status === 'rejected') {
      await this.ordersRepository.updateOrderStatus(order.id, OrderStatus.Cancelled);
      console.log(`Pago rechazado para la orden ${order.id}`);
    }

    return { received: true };
  }
}