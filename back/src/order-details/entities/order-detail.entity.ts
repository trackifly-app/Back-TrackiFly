import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "../../orders/entities/order.entity";

@Entity("order_details")
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column("int")
  quantity: number;

  @Column("decimal")
  unitPrice: number;

  @Column("decimal")
  subtotal: number;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: "CASCADE" })
  order: Order;
}
