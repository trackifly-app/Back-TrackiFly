import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderDetail } from "./order-detail.entity";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column("int")
  quantity: number;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details: OrderDetail[];
}
