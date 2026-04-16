import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Roles } from '../../roles/entities/roles.entity';
import { Profile } from '../../profiles/entities/profile.entity';
import { Company } from '../../companies/entities/company.entity';
import { UserStatus } from '../../common/enums/user-status.enum';

@Entity({ name: 'USERS' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: false })
  phone: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  address: string;

  @Column({ type: 'varchar', length: 2, nullable: false })
  country: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Roles, (role) => role.users, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile?: Profile;

  @OneToOne(() => Company, (company) => company.user)
  company?: Company;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.APPROVED })
  status: UserStatus;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'parent_company_id' })
  parentCompany?: User;
}
