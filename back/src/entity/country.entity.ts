import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { City } from './city.entity';
import { User } from '../user/entities/user.entity'


@Entity('pais')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id_pais: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 3 })
  codigo_iso_2: string;

  @Column({ length: 3 })
  codigo_iso_3: string;

  @Column({ length: 10 })
  codigo_telefonico: string;

  @Column({ length: 10 })
  acronimo: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario' })
  user: User;

  @OneToMany(() => City, (c) => c.country)
  cities: City[];
}
