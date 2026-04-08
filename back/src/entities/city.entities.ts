import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Country } from "./country.entities";
import { Address } from "./address.entity";

@Entity("ciudad")
export class City {
  @PrimaryGeneratedColumn("uuid")
    id_ciudad: string;

  @Column({ length: 100 })
  nombre: string;

  @ManyToOne(() => Country, (p) => p.cities)
  @JoinColumn({ name: "id_pais" })
  country: Country;

  @Column({ length: 100 })
  estado_provincia: string;

  @OneToMany(() => Address, (a) => a.city)
  addresses: Address[];
}
