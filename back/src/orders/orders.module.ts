import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { OrderDetailsController } from './order-details.controller';
import { OrderDetailsService } from './order-details.service';
import { OrderDetailsRepository } from './order-details.repository';

@Module({
  imports: [],
  controllers: [OrdersController, OrderDetailsController],
  providers: [
    OrdersService,
    OrdersRepository,
    OrderDetailsService,
    OrderDetailsRepository,
  ],
  exports: [OrdersRepository, OrderDetailsRepository],
})
export class OrdersModule {}
