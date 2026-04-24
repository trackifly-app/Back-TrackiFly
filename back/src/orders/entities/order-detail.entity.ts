import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Order } from "./order.entity";
import { Category } from "../../categories/entities/category.entity";

@Entity("order_details")
export class OrderDetail {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", name: "name" })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: true })
  image: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  height: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  width: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  depth: number;

  @Column({ type: "varchar", nullable: true })
  unit: string;

  @Column({ default: false })
  fragile: boolean;

  @Column({ default: false })
  dangerous: boolean;

  @Column({ default: false })
  cooled: boolean;

  @Column({ default: false })
  urgent: boolean;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: "category_id" })
  category: Category;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: "CASCADE" })
  @JoinColumn({ name: "order_id" })
  order: Order;

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;
}
