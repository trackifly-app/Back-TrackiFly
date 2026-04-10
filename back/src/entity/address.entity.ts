import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('direccion')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id_direccion: string;

  @Column({ length: 255 })
  calle: string;

  @Column({ type: 'text', nullable: true })
  referencia: string | null;

  @Column({ length: 20 })
  codigo_postal: string;

  @ManyToOne(() => City, (c) => c.addresses)
  @JoinColumn({ name: 'id_ciudad' })
  city: City;
}
