import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ROLE' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;
}
