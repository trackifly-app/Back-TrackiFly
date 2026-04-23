import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "../../orders/entities/order.entity";
import { MeasurementUnit } from "../../common/enums/measurement-unit.enum";

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

  // Detalles del artículo
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  // Propiedades físicas del paquete
  @Column("decimal", { nullable: true })
  weight: number;

  @Column("decimal", { nullable: true })
  height: number;

  @Column("decimal", { nullable: true })
  width: number;

  @Column("decimal", { nullable: true })
  depth: number;

  @Column({
    type: "enum",
    enum: MeasurementUnit,
    default: MeasurementUnit.CM,
    nullable: true,
  })
  unit: MeasurementUnit;

  // Servicios adicionales (banderas)
  @Column({ default: false })
  fragile: boolean;

  @Column({ default: false })
  dangerous: boolean;

  @Column({ default: false })
  cooled: boolean;

  @Column({ default: false })
  urgent: boolean;

  @ManyToOne(() => Order, (order) => order.details, { onDelete: "CASCADE" })
  order: Order;
}
