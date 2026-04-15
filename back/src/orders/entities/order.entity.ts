import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column("int")
  quantity: number;

  // Puedes agregar más campos según necesidades futuras
}
