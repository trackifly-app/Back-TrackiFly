import { Body, Controller, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('mercadopago')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  
  @Post('create-preference')
  async createPreference(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPreference(dto);
  }

  @Post('webhook')
  webhook(@Body() body: any,  @Query('id') queryId?: string,
    @Query('topic') topic?: string,) {

      // MercadoPago manda el webhook de dos formas:
    // Formato 1: ?id=123&topic=payment (query params)
    // Formato 2: body { type: "payment", data: { id: "123" } }
    if (topic === 'payment' && queryId) {
      return this.paymentsService.handleWebhook({
        type: 'payment',
        data: { id: queryId },
      });
    }

    return this.paymentsService.handleWebhook(
      body as { type: string; data?: { id: string } }
    );
  }
}