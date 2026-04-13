import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './user.entity';

@Entity({ name: 'ROLE' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
