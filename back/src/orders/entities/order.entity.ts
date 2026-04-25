import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderDetail } from "./order-detail.entity";
import { User } from "../../users/entities/user.entity";
import { OrderStatus } from "../../common/enums/order-status.enum";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", unique: true, nullable: true })
  tracking_code: string;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ type: "varchar", name: "pickup_direction", nullable: true })
  pickup_direction: string;

  @Column({ type: "varchar", name: "delivery_direction", nullable: true })
  delivery_direction: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  distance: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details: OrderDetail[];

  @CreateDateColumn({ name: "created_at" })
  created_at: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updated_at: Date;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;           // precio base enviado por el front

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  total_amount: number;    // monto final a cobrar (con descuentos si aplican)

  @Column({ type: "varchar", nullable: true })
  preference_id: string;   // id de MP — relaciona el pago con la orden
}
