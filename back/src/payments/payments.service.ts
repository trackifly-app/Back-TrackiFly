import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { environment } from '../config/environment';
import { CreatePaymentDto } from './dto/create-payment.dto';

// Porcentaje de descuento para empresas — lo dejamos como constante
// para que sea fácil de cambiar sin tocar la lógica
const COMPANY_DISCOUNT = 0.20;

// MercadoPago nos manda el webhook como `any`, así que definimos
// la forma que esperamos para que TypeScript no se queje
interface WebhookBody {
  type: string;         // MP manda "payment", "merchant_order", etc.
  data?: { id: string }; // el id del pago, viene dentro de data
}

@Injectable()
export class PaymentsService {
  // Guardamos la instancia de MP en la clase para no crearla
  // cada vez que alguien llama a createPreference
  private readonly mp: MercadoPagoConfig;

  constructor() {
    // Acá le decimos a MP con qué cuenta operar.
    // El accessToken identifica nuestra app — sin esto MP rechaza todo
    this.mp = new MercadoPagoConfig({
      accessToken: environment.MP_ACCESS_TOKEN!,
    });
  }

  async createPreference(
    dto: CreatePaymentDto,
    user: { id: string; role: string }
  ) {
    // Leemos el rol del usuario que viene del JWT (lo pone AuthGuard en req.user)
    // Si es Company aplicamos el 20% de descuento, si no el precio va tal cual
    const isCompany = user.role === 'Company';
    const finalAmount = isCompany
      ? dto.amount * (1 - COMPANY_DISCOUNT)
      : dto.amount;

    // Preference es la clase del SDK que representa
    // "quiero cobrar X por este concepto"
    const preference = new Preference(this.mp);

    // MP trabaja con "items" como si fuera un carrito.
    // En nuestro caso siempre es un solo ítem: el envío
    const response = await preference.create({
      body: {
        items: [
          {
            id: 'envio-trackifly',      // id interno nuestro, puede ser lo que quieras
            title: 'Envío Trackifly',   // lo que ve el usuario en la pantalla de MP
            quantity: 1,
            unit_price: finalAmount,    // el monto ya con descuento aplicado si corresponde
            currency_id: 'ARS',        // moneda — Argentina
          },
        ],

        // Acá le decimos a MP a dónde mandar al usuario después del pago.
        // Estas rutas las tiene que tener el front creadas
        back_urls: {
          success: `${environment.FRONTEND_URL}/payment/success`,
          failure: `${environment.FRONTEND_URL}/payment/failure`,
          pending: `${environment.FRONTEND_URL}/payment/pending`,
        },

        // Con esto le decimos que si el pago fue aprobado,
        // que redirija automáticamente sin que el usuario tenga que hacer click
        auto_return: 'approved',

        // Esta es la URL que MP va a llamar cuando el pago cambie de estado.
        // Tiene que ser una URL pública — por eso usamos la de Railway
        notification_url: `${environment.APP_URL}/api/mercadopago/webhook`,

        // Guardamos data nuestra dentro del pago para poder
        // identificar después quién pagó y con qué descuento
        metadata: {
          user_id: user.id,
          role: user.role,
          original_amount: dto.amount,
          final_amount: finalAmount,
          discount_applied: isCompany,
        },
      },
    });

    // Devolvemos al front la URL de pago (init_point) y datos del precio
    // para que pueda mostrar el desglose antes de redirigir
    return {
      checkout_url: response.init_point,  // ← el front redirige acá
      preference_id: response.id,
      original_amount: dto.amount,
      final_amount: finalAmount,
      discount_applied: isCompany ? '20%' : null,
    };
  }

  // Este método lo llama el controller cuando MP toca el webhook.
  // Por ahora solo registramos el pago en consola —
  // acá es donde más adelante podés guardar el pago en la DB,
  // cambiar el estado de una orden, mandar un mail, etc.
  handleWebhook(body: WebhookBody) {
    // MP manda muchos tipos de notificaciones (merchant_order, payment, etc.)
    // Nosotros solo nos interesa "payment"
    if (body.type !== 'payment') return { received: true };

    const paymentId = body.data?.id;
    if (!paymentId) return { received: true };

    // Por ahora logueamos — próximo paso: consultar el pago a MP
    // con este id y guardarlo en la base de datos
    console.log(`Pago recibido: ${paymentId}`);

    // Siempre devolvemos 200 a MP para que sepa que recibimos la notificación.
    // Si devolvemos error, MP reintenta varias veces
    return { received: true };
  }
}