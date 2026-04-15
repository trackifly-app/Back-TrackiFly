import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Gender } from '../../common/enums/gender.enum';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'PROFILES' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  first_name: string;

  @Column({ type: 'varchar', length: 80, nullable: false })
  last_name: string;

  @Column({ type: 'date', nullable: false })
  birthdate: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
