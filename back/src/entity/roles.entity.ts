import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("rol")
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id_rol: string;

  @Column({ length: 50 })
  nombre: string;


}
