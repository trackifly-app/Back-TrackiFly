import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { OrderDetail } from "../../order-details/entities/order-detail.entity";
import { User } from "../../users/entities/user.entity";
import { OrderStatus } from "../../common/enums/order-status.enum";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column("int")
  quantity: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Column({ nullable: true })
  pickup_direction: string;

  @Column({ nullable: true })
  delivery_direction: string;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details: OrderDetail[];
}
