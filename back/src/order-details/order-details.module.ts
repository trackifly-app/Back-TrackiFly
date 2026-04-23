import { Module } from "@nestjs/common";
import { OrderDetailsController } from "./order-details.controller";
import { OrderDetailsService } from "./order-details.service";
import { OrderDetailsRepository } from "./order-details.repository";

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailsService, OrderDetailsRepository],
  exports: [OrderDetailsRepository],
})
export class OrderDetailsModule {}
