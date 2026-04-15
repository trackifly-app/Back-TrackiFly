import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.create(createOrderDto);
    return await this.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return await this.find();
  }

  async findOrderById(id: number): Promise<Order | undefined> {
    const order = await this.findOne({ where: { id } });
    return order ?? undefined;
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | undefined> {
    const order = await this.preload({ id, ...updateOrderDto });
    if (!order) return undefined;
    return await this.save(order);
  }

  async removeOrder(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0;
  }
}
