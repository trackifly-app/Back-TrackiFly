import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OtpRepository } from '../repositories/otp.repository';
import { OtpType } from '../enums/otp-type.enum';

/** Minutos de validez de un OTP */
const OTP_EXPIRATION_MINUTES = 10;

/** Cantidad máxima de OTPs permitidos en la ventana de rate-limit */
const MAX_OTP_REQUESTS = 3;

/** Ventana de tiempo para rate-limit (en minutos) */
const RATE_LIMIT_WINDOW_MINUTES = 15;

/** Rondas de bcrypt para hashear el OTP */
const BCRYPT_ROUNDS = 10;

/**
 * Servicio dedicado a la generación, verificación y gestión de códigos OTP.
 *
 * Responsabilidad única:
 * - Generar códigos de 6 dígitos criptográficamente seguros.
 * - Hashearlos con bcrypt antes de persistirlos.
 * - Verificar códigos comparando hashes.
 * - Aplicar rate-limiting de reenvíos.
 * - Limpiar códigos expirados periódicamente.
 *
 * NO envía emails ni emite eventos. Eso le corresponde a MailService y al Listener.
 */
@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);

  constructor(private readonly otpRepository: OtpRepository) {}

  /**
   * Genera un código OTP de 6 dígitos, lo hashea y lo persiste.
   *
   * @param userId - UUID del usuario
   * @param type - Tipo de OTP (verificación de email o reset de contraseña)
   * @returns El código OTP en texto plano (para enviar por email)
   * @throws BadRequestException si se excede el rate-limit
   */
  async generateOtp(userId: string, type: OtpType): Promise<string> {
    // 1. Rate-limit: verificar que no se haya excedido el máximo de solicitudes
    await this.enforceRateLimit(userId, type);

    // 2. Invalidar OTPs previos del mismo tipo (evitar flooding)
    await this.otpRepository.invalidateAllByUser(userId, type);

    // 3. Generar código de 6 dígitos criptográficamente seguro
    const plainCode = this.generateSecureCode();

    // 4. Hashear con bcrypt
    const hashedCode = await bcrypt.hash(plainCode, BCRYPT_ROUNDS);

    // 5. Calcular fecha de expiración
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRATION_MINUTES);

    // 6. Persistir
    await this.otpRepository.create({
      user_id: userId,
      hashed_code: hashedCode,
      type,
      expires_at: expiresAt,
    });

    this.logger.log(
      `OTP generado para usuario ${userId} [tipo: ${type}, expira: ${expiresAt.toISOString()}]`,
    );

    return plainCode;
  }

  /**
   * Verifica un código OTP contra los registros activos del usuario.
   *
   * @param userId - UUID del usuario
   * @param plainCode - Código OTP en texto plano ingresado por el usuario
   * @param type - Tipo de OTP esperado
   * @throws UnauthorizedException si el código es inválido o está expirado
   */
  async verifyOtp(userId: string, plainCode: string, type: OtpType): Promise<void> {
    const activeOtps = await this.otpRepository.findActiveByUser(userId, type);

    if (activeOtps.length === 0) {
      throw new UnauthorizedException(
        'No hay códigos de verificación activos. Solicita uno nuevo.',
      );
    }

    for (const otp of activeOtps) {
      // Verificar expiración
      if (new Date() > otp.expires_at) {
        continue; // Saltar OTPs expirados
      }

      // Comparar hash
      const isValid = await bcrypt.compare(plainCode, otp.hashed_code);
      if (isValid) {
        // Marcar como usado
        await this.otpRepository.markAsUsed(otp.id);
        this.logger.log(`OTP verificado exitosamente para usuario ${userId} [tipo: ${type}]`);
        return;
      }
    }

    throw new UnauthorizedException(
      'El código de verificación es incorrecto o ha expirado.',
    );
  }

  /**
   * Genera un número de 6 dígitos criptográficamente seguro.
   * Usa crypto.randomInt() en lugar de Math.random() para evitar previsibilidad.
   */
  private generateSecureCode(): string {
    const code = crypto.randomInt(100000, 999999);
    return code.toString();
  }

  /**
   * Verifica que el usuario no haya excedido el límite de solicitudes de OTP.
   *
   * @throws BadRequestException si se excede el límite
   */
  private async enforceRateLimit(userId: string, type: OtpType): Promise<void> {
    const since = new Date();
    since.setMinutes(since.getMinutes() - RATE_LIMIT_WINDOW_MINUTES);

    const recentCount = await this.otpRepository.countRecentByUser(userId, type, since);

    if (recentCount >= MAX_OTP_REQUESTS) {
      throw new BadRequestException(
        `Has excedido el límite de ${MAX_OTP_REQUESTS} solicitudes de código. ` +
        `Intenta de nuevo en ${RATE_LIMIT_WINDOW_MINUTES} minutos.`,
      );
    }
  }

  /**
   * Cron job: limpia OTPs expirados y usados cada hora.
   * Mantiene la tabla OTP_CODES limpia y con buen rendimiento.
   */
  @Cron(CronExpression.EVERY_HOUR)
  async handleOtpCleanup(): Promise<void> {
    this.logger.log('Ejecutando limpieza programada de OTPs expirados...');
    const deleted = await this.otpRepository.deleteExpiredAndUsed();
    this.logger.log(`Limpieza completada: ${deleted} OTPs eliminados`);
  }
}
