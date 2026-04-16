import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { OrderDetail } from "./entities/order-detail.entity";
import { CreateOrderDetailDto } from "./dto/create-order-detail.dto";
import { UpdateOrderDetailDto } from "./dto/update-order-detail.dto";

@Injectable()
export class OrderDetailsRepository extends Repository<OrderDetail> {
  constructor(private dataSource: DataSource) {
    super(OrderDetail, dataSource.createEntityManager());
  }

  async createDetail(createDto: CreateOrderDetailDto): Promise<OrderDetail> {
    const subtotal = createDto.quantity * createDto.unitPrice;
    const detail = this.create({
      ...createDto,
      subtotal,
      order: { id: createDto.orderId },
    });
    return await this.save(detail);
  }

  async findAllDetails(): Promise<OrderDetail[]> {
    return await this.find({ relations: ["order"] });
  }

  async findDetailsByOrder(orderId: number): Promise<OrderDetail[]> {
    return await this.find({
      where: { order: { id: orderId } },
      relations: ["order"],
    });
  }

  async findDetailById(id: number): Promise<OrderDetail | undefined> {
    const detail = await this.findOne({ where: { id }, relations: ["order"] });
    return detail ?? undefined;
  }

  async updateDetail(
    id: number,
    updateDto: UpdateOrderDetailDto,
  ): Promise<OrderDetail | undefined> {
    const existing = await this.findOne({ where: { id } });
    if (!existing) return undefined;
    const quantity = updateDto.quantity ?? existing.quantity;
    const unitPrice = updateDto.unitPrice ?? existing.unitPrice;
    const subtotal = quantity * unitPrice;
    const detail = await this.preload({ id, ...updateDto, subtotal });
    if (!detail) return undefined;
    return await this.save(detail);
  }

  async removeDetail(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }
}
