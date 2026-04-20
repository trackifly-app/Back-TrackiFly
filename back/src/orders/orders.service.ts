import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    return await this.ordersRepository.createOrder(createOrderDto, userId);
  }

  async findAll(): Promise<Order[]> {
    return await this.ordersRepository.findAllOrders();
  }

  async findByUser(userId: string): Promise<Order[]> {
    return await this.ordersRepository.findOrdersByUser(userId);
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOrderById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.updateOrder(id, updateOrderDto);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async remove(id: number): Promise<void> {
    const removed = await this.ordersRepository.removeOrder(id);
    if (!removed) throw new NotFoundException('Order not found');
  }
}
