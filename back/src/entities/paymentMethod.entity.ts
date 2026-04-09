import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./user.entity";

@Entity("forma_de_pago")
export class PaymentMethod {
  @PrimaryGeneratedColumn("uuid")
  id_forma_de_pago: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: "text", nullable: true })
  descripcion: string | null;

  @Column({ type: "text", nullable: true })
  imagen_referencia: string | null;

  @OneToMany(() => User, (u) => u.paymentMethod)
  users: User[];
}
