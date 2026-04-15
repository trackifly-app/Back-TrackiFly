import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../common/enums/role.enum';

@Entity({ name: 'ROLES' })
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Role, unique: true, nullable: false })
  name: Role;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
