import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderDetailsRepository } from './order-details.repository';
import { CreateOrderDetailDto } from './dto/create-order-detail.dto';
import { UpdateOrderDetailDto } from './dto/update-order-detail.dto';

@Injectable()
export class OrderDetailsService {
  constructor(private readonly orderDetailsRepository: OrderDetailsRepository) {}

  async create(createDto: CreateOrderDetailDto): Promise<OrderDetail> {
    return await this.orderDetailsRepository.createDetail(createDto);
  }

  async findAll(): Promise<OrderDetail[]> {
    return await this.orderDetailsRepository.findAllDetails();
  }

  async findByOrder(orderId: number): Promise<OrderDetail[]> {
    return await this.orderDetailsRepository.findDetailsByOrder(orderId);
  }

  async findOne(id: number): Promise<OrderDetail> {
    const detail = await this.orderDetailsRepository.findDetailById(id);
    if (!detail) throw new NotFoundException('Order detail not found');
    return detail;
  }

  async update(id: number, updateDto: UpdateOrderDetailDto): Promise<OrderDetail> {
    const detail = await this.orderDetailsRepository.updateDetail(id, updateDto);
    if (!detail) throw new NotFoundException('Order detail not found');
    return detail;
  }

  async remove(id: number): Promise<void> {
    const removed = await this.orderDetailsRepository.removeDetail(id);
    if (!removed) throw new NotFoundException('Order detail not found');
  }
}
