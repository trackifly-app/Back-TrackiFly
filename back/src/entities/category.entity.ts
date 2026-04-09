import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './product.entity';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id_categoria: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @OneToMany(() => Product, (p) => p.category)
  products: Product[];
}
