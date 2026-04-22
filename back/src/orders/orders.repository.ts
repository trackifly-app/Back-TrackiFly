import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }
  
  async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<any> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Create the Order
      const order = manager.create(Order, {
        pickup_direction: createOrderDto.pickup_direction,
        delivery_direction: createOrderDto.delivery_direction,
        distance: createOrderDto.distance,
        user: { id: userId } as any,
      });

      const savedOrder = await manager.save(order);

      // 2. Create the OrderDetail
      const detail = manager.create(OrderDetail, {
        name: createOrderDto.name, 
        description: createOrderDto.description || '',
        image: createOrderDto.image || '',
        weight: createOrderDto.weight,
        height: createOrderDto.height,
        width: createOrderDto.width,
        depth: createOrderDto.depth,
        unit: createOrderDto.unit,
        fragile: createOrderDto.fragile,
        dangerous: createOrderDto.dangerous,
        cooled: createOrderDto.cooled,
        urgent: createOrderDto.urgent,
        category: { id: createOrderDto.category_id } as any,
        order: savedOrder,
      });

      await manager.save(detail);

      return {
        id: savedOrder.id,
        status: savedOrder.status,
        pickup_direction: savedOrder.pickup_direction,
        delivery_direction: savedOrder.delivery_direction,
        distance: savedOrder.distance,
        userId: userId,
        packageDetails: {
          name: detail.name,
          weight: detail.weight,
          dimensions: `${detail.height}x${detail.width}x${detail.depth} ${detail.unit}`,
          fragile: detail.fragile,
          urgent: detail.urgent,
          category_id: createOrderDto.category_id
        }
      };
    });
  }

  async findAllOrders(): Promise<any[]> {
    const orders = await this.find({ 
      relations: ['user', 'details', 'details.category'] 
    });
    
    return orders.map(order => this.mapOrderResponse(order));
  }

  async findOrderById(id: string): Promise<any | undefined> {
    const order = await this.findOne({ 
      where: { id }, 
      relations: ['user', 'details', 'details.category'] 
    });
    return order ? this.mapOrderResponse(order) : undefined;
  }

  async findOrdersByUser(userId: string): Promise<any[]> {
    const orders = await this.find({ 
      where: { user: { id: userId } }, 
      relations: ['user', 'details', 'details.category'] 
    });
    return orders.map(order => this.mapOrderResponse(order));
  }

  private mapOrderResponse(order: Order) {
    const detail = order.details?.[0]; 
    return {
      id: order.id,
      status: order.status,
      pickup_direction: order.pickup_direction,
      delivery_direction: order.delivery_direction,
      distance: order.distance,
      created_at: order.created_at,
      userId: order.user?.id, 
      package: detail ? {
        id: detail.id,
        name: detail.name,
        description: detail.description,
        weight: detail.weight,
        dimensions: {
          height: detail.height,
          width: detail.width,
          depth: detail.depth,
          unit: detail.unit
        },
        fragile: detail.fragile,
        urgent: detail.urgent,
        category: detail.category?.name || 'N/A'
      } : null
    };
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order | undefined> {
    const order = await this.preload({ id, ...updateOrderDto });
    if (!order) return undefined;
    return await this.save(order);
  }

  async removeOrder(id: string): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected !== 0 && result.affected !== null;
  }
}
