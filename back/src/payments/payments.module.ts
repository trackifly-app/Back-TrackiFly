import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
    // Importamos OrdersModule porque PaymentsService necesita OrdersRepository.
  // NestJS maneja la inyección de dependencias por módulos —
  // si no importamos el módulo acá, el service no puede usar el repository
  // aunque lo pongamos en el constructor
  imports:[OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}