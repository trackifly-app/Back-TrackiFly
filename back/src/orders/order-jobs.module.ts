import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { OrderJobsProcessor } from './order-jobs.processor';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'order-status',
    }),
  ],
  providers: [OrderJobsProcessor, OrdersService, OrdersRepository],
  exports: [BullModule],
})
export class OrderJobsModule {}
