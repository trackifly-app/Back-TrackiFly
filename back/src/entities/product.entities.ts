import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Category } from "./category.entities";

@Entity("productos")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id_producto: string;

  @Column({ length: 150 })
  nombre: string;

  @Column({ type: "text", nullable: true })
  descripcion: string | null;

  @Column()
  stock: number;

  @Column({ length: 255, nullable: true })
  imagen_url: string | null;

  @ManyToOne(() => Category, (c) => c.products)
  @JoinColumn({ name: "id_categoria" })
  category: Category;

  @Column({ type: "decimal", precision: 12, scale: 2, nullable: true })
  volumen: number | null;

  @Column({ length: 100, nullable: true })
  forma_de_empaque: string | null;

  @Column({ nullable: true })
  cantidad_productos: number | null;
}
