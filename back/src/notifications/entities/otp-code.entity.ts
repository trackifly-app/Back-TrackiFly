import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OtpType } from '../enums/otp-type.enum';

/**
 * Entidad que representa un código OTP en la base de datos.
 *
 * - El código en texto plano NUNCA se almacena; solo su hash bcrypt.
 * - Cada OTP tiene una expiración de 10 minutos.
 * - Al generar un nuevo OTP, los anteriores del mismo tipo se invalidan.
 */
@Entity({ name: 'OTP_CODES' })
@Index(['user_id', 'type', 'is_used']) // Index compuesto para búsquedas frecuentes
export class OtpCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /**
   * Hash bcrypt del código OTP de 6 dígitos.
   * El código en texto plano solo se envía por email y nunca se persiste.
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  hashed_code: string;

  @Column({
    type: 'enum',
    enum: OtpType,
    nullable: false,
  })
  type: OtpType;

  /**
   * Fecha y hora en la que el código expira.
   * Por defecto: 10 minutos después de la creación.
   */
  @Column({ type: 'timestamp', nullable: false })
  expires_at: Date;

  /**
   * Indica si el código ya fue utilizado.
   * Un código usado no puede volver a verificarse.
   */
  @Column({ type: 'boolean', default: false })
  is_used: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
