import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CompanyPlan } from '../../common/enums/company-plan.enum';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'COMPANIES' })
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  company_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  industry: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  contact_name: string;

  @Column({ type: 'enum', enum: CompanyPlan, nullable: false, default: CompanyPlan.FREE })
  plan: CompanyPlan;

  @OneToOne(() => User, (user) => user.company, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
