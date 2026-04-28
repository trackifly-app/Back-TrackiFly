import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { OtpCode } from '../entities/otp-code.entity';
import { OtpType } from '../enums/otp-type.enum';

/**
 * Repositorio dedicado a operaciones de persistencia de códigos OTP.
 * Responsabilidad única: acceso a datos de la tabla OTP_CODES.
 */
@Injectable()
export class OtpRepository {
  private readonly logger = new Logger(OtpRepository.name);

  constructor(
    @InjectRepository(OtpCode)
    private readonly ormRepository: Repository<OtpCode>,
  ) {}

  /**
   * Crea y persiste un nuevo registro OTP.
   */
  async create(data: {
    user_id: string;
    hashed_code: string;
    type: OtpType;
    expires_at: Date;
  }): Promise<OtpCode> {
    const otp = this.ormRepository.create(data);
    return this.ormRepository.save(otp);
  }

  /**
   * Busca todos los OTPs activos (no usados y no expirados) de un usuario
   * para un tipo específico, ordenados del más reciente al más antiguo.
   */
  async findActiveByUser(userId: string, type: OtpType): Promise<OtpCode[]> {
    return this.ormRepository.find({
      where: {
        user_id: userId,
        type,
        is_used: false,
      },
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Invalida (marca como usados) todos los OTPs activos de un usuario
   * para un tipo específico. Se ejecuta antes de generar un nuevo OTP.
   */
  async invalidateAllByUser(userId: string, type: OtpType): Promise<void> {
    await this.ormRepository.update(
      { user_id: userId, type, is_used: false },
      { is_used: true },
    );
  }

  /**
   * Marca un OTP específico como usado.
   */
  async markAsUsed(otpId: string): Promise<void> {
    await this.ormRepository.update(otpId, { is_used: true });
  }

  /**
   * Cuenta los OTPs generados por un usuario en un rango de tiempo.
   * Usado para rate-limiting de reenvíos.
   */
  async countRecentByUser(
    userId: string,
    type: OtpType,
    since: Date,
  ): Promise<number> {
    return this.ormRepository
      .createQueryBuilder('otp')
      .where('otp.user_id = :userId', { userId })
      .andWhere('otp.type = :type', { type })
      .andWhere('otp.created_at >= :since', { since })
      .getCount();
  }

  /**
   * Elimina OTPs expirados y usados de la base de datos.
   * Ejecutado por el cron job de limpieza.
   */
  async deleteExpiredAndUsed(): Promise<number> {
    const result = await this.ormRepository
      .createQueryBuilder()
      .delete()
      .from(OtpCode)
      .where('is_used = :isUsed', { isUsed: true })
      .orWhere('expires_at < :now', { now: new Date() })
      .execute();

    const deleted = result.affected ?? 0;
    if (deleted > 0) {
      this.logger.log(`Limpieza OTP: ${deleted} registros eliminados`);
    }
    return deleted;
  }
}
