import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { OrderDetail } from "./entities/order-detail.entity";
import { Category } from "../categories/entities/category.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { OrderStatus } from "../common/enums/order-status.enum";

import { CreatedOrderResult } from "./interfaces/created-order-result.interface";

@Injectable()
export class OrdersRepository extends Repository<Order> {
  constructor(private dataSource: DataSource) {
    super(Order, dataSource.createEntityManager());
  }

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: string,
  ): Promise<CreatedOrderResult> {
    // Validamos que la categoría exista antes de abrir la transacción
    const category = await this.dataSource.getRepository(Category).findOne({
      where: { id: createOrderDto.category_id },
    });
    if (!category) {
      throw new NotFoundException(
        `La categoría con id '${createOrderDto.category_id}' no existe. Consulta GET /categories para ver las categorías disponibles.`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const generatedCode =
        "VLZ-2026-" + Math.random().toString(36).substr(2, 6).toUpperCase();

      // Primero creamos la orden con los datos del envío
      const order = manager.create(Order, {
        tracking_code: generatedCode,
        pickup_direction: createOrderDto.pickup_direction,
        delivery_direction: createOrderDto.delivery_direction,
        distance: createOrderDto.distance,
        price: createOrderDto.price,
        user: { id: userId } as any,
      });

      const savedOrder = await manager.save(order);

      // Después creamos el detalle con los datos del paquete,
      // asociado a la orden que acabamos de guardar
      const defaultImage =
        "https://cdn-icons-png.flaticon.com/512/683/683030.png";

      const detail = manager.create(OrderDetail, {
        name: createOrderDto.name,
        description: createOrderDto.description || "",
        image: createOrderDto.image || defaultImage,
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
        tracking_code: savedOrder.tracking_code,
        status: savedOrder.status,
        pickup_direction: savedOrder.pickup_direction,
        delivery_direction: savedOrder.delivery_direction,
        distance: savedOrder.distance,
        price: savedOrder.price,
        userId: userId,
        packageDetails: {
          name: detail.name,
          weight: detail.weight,
          dimensions: `${detail.height}x${detail.width}x${detail.depth} ${detail.unit}`,
          fragile: detail.fragile,
          urgent: detail.urgent,
          dangerous: detail.dangerous,
          cooled: detail.cooled,
          image: detail.image,
          category_id: createOrderDto.category_id,
        },
      };
    });
  }

  async findAllOrders(): Promise<any[]> {
    const orders = await this.find({
      relations: ["user", "details", "details.category"],
    });
    return orders.map((order) => this.mapOrderResponse(order));
  }

  async findOrderById(id: string): Promise<any | undefined> {
    const order = await this.findOne({
      where: { id },
      relations: ["user", "details", "details.category"],
    });
    return order ? this.mapOrderResponse(order) : undefined;
  }

  async findOrdersByUser(userId: string): Promise<any[]> {
    const orders = await this.find({
      where: { user: { id: userId } },
      relations: ["user", "details", "details.category"],
    });
    return orders.map((order) => this.mapOrderResponse(order));
  }

  private mapOrderResponse(order: Order) {
    const detail = order.details?.[0];
    return {
      id: order.id,
      tracking_code: order.tracking_code,
      status: order.status,
      pickup_direction: order.pickup_direction,
      delivery_direction: order.delivery_direction,
      distance: order.distance,
      price: order.price,
      created_at: order.created_at,
      userId: order.user?.id,
      package: detail
        ? {
            id: detail.id,
            name: detail.name,
            description: detail.description,
            weight: detail.weight,
            dimensions: {
              height: detail.height,
              width: detail.width,
              depth: detail.depth,
              unit: detail.unit,
            },
            image: detail.image,
            fragile: detail.fragile,
            urgent: detail.urgent,
            dangerous: detail.dangerous,
            cooled: detail.cooled,
            category: detail.category?.name || "N/A",
          }
        : null,
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

  async findOrderByPreferenceId(
    preferenceId: string,
  ): Promise<Order | undefined> {
    // Buscamos la orden por el preference_id que guardamos cuando el usuario
    // inició el pago — es el puente entre MP y nuestra base de datos
    const order = await this.findOne({
      where: { preference_id: preferenceId },
    });
    return order ?? undefined;
  }

  async findOrderByTrackingCode(
    trackingCode: string,
  ): Promise<any | undefined> {
    const order = await this.findOne({
      where: { tracking_code: trackingCode },
      relations: ["user", "details", "details.category"],
    });
    return order ? this.mapOrderResponse(order) : undefined;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    // Solo tocamos el status — el resto de los datos de la orden no cambian
    await this.update(id, { status });
  }
}
