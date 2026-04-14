import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../../common/gender.enum';
import { Roles } from '../../roles/entities/roles.entity';


@Entity({ name: 'USERS' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 80, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  address: string;

  @Column({ type: 'bigint', nullable: false })
  phone: number;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'date', nullable: false })
  birthdate: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  country: string;

  @ManyToOne(() => Roles, (role) => role.users, { nullable: false, eager: true  })
  @JoinColumn({ name: 'role_id' })
  role: Roles;
}
