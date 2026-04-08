import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Role } from "./roles.entities";
import { PaymentMethod } from "./paymentMethod.entities";
import { Order } from "./order.entities";

@Entity("usuarios")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id_usuario: string;

  @Column({ length: 100 })
  nombre: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "id_rol" })
  role: Role;

  @ManyToOne(() => PaymentMethod, (pm) => pm.users)
  @JoinColumn({ name: "id_forma_de_pago" })
  paymentMethod: PaymentMethod;

  @Column({ length: 255 })
  correo: string;

  @Column()
  password: string;

  @Column({ length: 20, nullable: true })
  telefono: string | null;

  @Column({ length: 255, nullable: true })
  imagen: string | null;

  @Column({ type: "date", nullable: true })
  fecha_de_nacimiento: string | null;

  @Column({ length: 50 })
  estado: string;

  @Column({ default: true })
  notificaciones: boolean;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: "timestamp", nullable: true })
  ultima_sesion: Date | null;

  @Column({ type: "timestamp", nullable: true })
  ultimo_login: Date | null;

  @Column({ type: "timestamp", nullable: true })
  ultimo_login_fecha: Date | null;

  @Column({ length: 50 })
  estado_de_la_cuenta: string;

  @Column({ default: false })
  verificacion_email: boolean;

  @OneToMany(() => Order, (o) => o.user)
  orders: Order[];
}
