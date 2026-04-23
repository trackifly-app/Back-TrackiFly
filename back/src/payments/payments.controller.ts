import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

// Le decimos a NestJS que todos los endpoints de este controller
// viven bajo /api/mercadopago (el /api lo agrega el prefijo global en main.ts)
@Controller('mercadopago')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Este endpoint lo llama el FRONT cuando el usuario quiere pagar.
  // AuthGuard lo protege — si no hay cookie con token válido, devuelve 401.
  // Así garantizamos que solo usuarios logueados puedan iniciar un pago
  @UseGuards(AuthGuard)
  @Post('create-preference')
  async createPreference(
    @Body() dto: CreatePaymentDto,
    // AuthGuard ya validó el JWT y puso el payload en req.user.
    // De ahí sacamos el id y el role para saber si aplicar descuento
    @Req() req: Request & { user: { id: string; role: string; status: string } },
  ) {
    return this.paymentsService.createPreference(dto, req.user);
  }

  // Este endpoint lo llama MERCADOPAGO automáticamente cuando el pago cambia de estado.
  // NO lleva AuthGuard porque MP no manda un JWT nuestro —
  // es un servidor externo que nos avisa que algo pasó.
  // La seguridad acá se hace verificando la firma del header x-signature (próximo paso)
  @Post('webhook')
  webhook(@Body() body: any) {
    // Casteamos el body al tipo que definimos en el service
    // para que TypeScript sepa qué forma tiene el dato
    return this.paymentsService.handleWebhook(
      body as { type: string; data?: { id: string } }
    );
  }
}