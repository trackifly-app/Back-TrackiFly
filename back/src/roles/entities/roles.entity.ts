import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../user/entities/users.entity';
import { Role } from '../../common/roles.enum';

@Entity({ name: 'ROLES' })
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, unique: true, length: 10, nullable: false })
  name: string;

  @OneToMany(() => Users, (user) => user.role)
  users: Users[];
}
