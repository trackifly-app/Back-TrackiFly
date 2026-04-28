import { Body, Controller, Post } from '@nestjs/common';
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
  webhook(@Body() body: any) {
    return this.paymentsService.handleWebhook(
      body as { type: string; data?: { id: string } }
    );
  }
}