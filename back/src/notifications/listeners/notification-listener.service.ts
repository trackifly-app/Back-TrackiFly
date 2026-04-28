import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OtpService } from '../services/otp.service';
import { MailService } from '../services/mail.service';
import { OtpType } from '../enums/otp-type.enum';
import {
  NOTIFICATION_EVENTS,
  UserRegisteredPayload,
  PasswordResetRequestedPayload,
  OtpResendRequestedPayload,
} from '../events/notification-events';

/**
 * Listener centralizado de eventos de notificación.
 *
 * Responsabilidad única: escuchar eventos del EventEmitter y
 * coordinar la generación de OTP + envío de email.
 *
 * Cada handler es asíncrono y no bloquea el flujo principal de la API.
 * Si el envío falla, se loguea el error pero no afecta la respuesta al usuario.
 *
 * Punto de extensión: agregar nuevos @OnEvent() aquí para futuros
 * tipos de notificación (order.shipped, payment.received, etc.)
 */
@Injectable()
export class NotificationListenerService {
  private readonly logger = new Logger(NotificationListenerService.name);

  constructor(
    private readonly otpService: OtpService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Evento: usuario recién registrado.
   * Genera OTP de verificación de email y lo envía por correo.
   */
  @OnEvent(NOTIFICATION_EVENTS.USER_REGISTERED, { async: true })
  async handleUserRegistered(payload: UserRegisteredPayload): Promise<void> {
    this.logger.log(
      `Procesando evento USER_REGISTERED (Bienvenida) para ${payload.email}`,
    );

    try {
      // En lugar de generar OTP, enviamos email de bienvenida directamente
      await this.mailService.sendWelcomeEmail(payload.email, payload.name || 'Usuario');
    } catch (error) {
      this.logger.error(
        `Error enviando email de bienvenida a ${payload.email}: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Evento: usuario solicita reset de contraseña.
   * Genera OTP de recuperación y lo envía por correo.
   */
  @OnEvent(NOTIFICATION_EVENTS.PASSWORD_RESET_REQUESTED, { async: true })
  async handlePasswordResetRequested(
    payload: PasswordResetRequestedPayload,
  ): Promise<void> {
    this.logger.log(
      `Procesando evento PASSWORD_RESET_REQUESTED para ${payload.email}`,
    );

    try {
      const code = await this.otpService.generateOtp(
        payload.userId,
        OtpType.PASSWORD_RESET,
      );
      await this.mailService.sendPasswordReset(payload.email, code);
    } catch (error) {
      this.logger.error(
        `Error procesando PASSWORD_RESET_REQUESTED para ${payload.email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }

  /**
   * Evento: usuario solicita reenvío de OTP.
   * Genera un nuevo OTP del tipo solicitado y lo envía por correo.
   */
  @OnEvent(NOTIFICATION_EVENTS.OTP_RESEND_REQUESTED, { async: true })
  async handleOtpResendRequested(
    payload: OtpResendRequestedPayload,
  ): Promise<void> {
    this.logger.log(
      `Procesando evento OTP_RESEND_REQUESTED para ${payload.email} [tipo: ${payload.type}]`,
    );

    try {
      const otpType = payload.type as OtpType;
      const code = await this.otpService.generateOtp(payload.userId, otpType);

      if (otpType === OtpType.EMAIL_VERIFICATION) {
        await this.mailService.sendOtpVerification(payload.email, code);
      } else if (otpType === OtpType.PASSWORD_RESET) {
        await this.mailService.sendPasswordReset(payload.email, code);
      }
    } catch (error) {
      this.logger.error(
        `Error procesando OTP_RESEND_REQUESTED para ${payload.email}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
