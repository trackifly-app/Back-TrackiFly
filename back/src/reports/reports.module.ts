import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { User } from "../users/entities/user.entity";
import { Company } from "../companies/entities/company.entity";
import { Order } from "../orders/entities/order.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, Order])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
