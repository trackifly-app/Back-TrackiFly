import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./orders.repository";
import { Order } from "./entities/order.entity";
import { OrderDetail } from "./entities/order-detail.entity";
import { PaymentsModule } from "../payments/payments.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetail]),
    forwardRef(() => PaymentsModule)
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersRepository, OrdersService],
})
export class OrdersModule {}