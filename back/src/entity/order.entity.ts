import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Address } from './address.entity';

@Entity('pedidos')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id_pedido: string;

  @ManyToOne(() => User, (u) => u.orders)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_producto' })
  product: Product;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'id_direccion_entrega' })
  deliveryAddress: Address;

  @Column({ length: 255 })
  direccion_predeterminada: string;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'timestamp', nullable: true })
  fecha_entrega: Date | null;

  @Column()
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;
}
