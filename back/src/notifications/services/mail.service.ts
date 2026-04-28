import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

/**
 * Servicio dedicado exclusivamente al envío de correos electrónicos.
 * Responsabilidad única: componer y despachar emails usando templates EJS.
 *
 * NO conoce la lógica de OTP, usuarios ni eventos.
 * Otros servicios le indican qué enviar.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Envía un correo electrónico usando un template EJS.
   *
   * @param to - Dirección de email del destinatario
   * @param subject - Asunto del correo
   * @param template - Nombre del archivo EJS (sin extensión)
   * @param context - Variables que se inyectan al template EJS
   */
  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });
      this.logger.log(`Email enviado exitosamente a ${to} [template: ${template}]`);
    } catch (error) {
      this.logger.error(
        `Error al enviar email a ${to} [template: ${template}]: ${(error as Error).message}`,
        (error as Error).stack,
      );
      // No lanzamos la excepción para no romper el flujo principal.
      // El envío de email es asíncrono y no debe bloquear la API.
    }
  }

  /**
   * Envía un email de verificación OTP.
   */
  async sendOtpVerification(to: string, code: string): Promise<void> {
    await this.sendMail(to, 'Verifica tu cuenta — TrackiFly', 'otp-verification', {
      code,
      expirationMinutes: 10,
      year: new Date().getFullYear(),
    });
  }

  /**
   * Envía un email de recuperación de contraseña.
   */
  async sendPasswordReset(to: string, code: string): Promise<void> {
    await this.sendMail(to, 'Restablece tu contraseña — TrackiFly', 'password-reset', {
      code,
      expirationMinutes: 10,
      year: new Date().getFullYear(),
    });
  }

  /**
   * Envía una notificación genérica (alerta, aviso, felicitación).
   * Punto de extensión para futuros tipos de notificación.
   */
  async sendGenericNotification(
    to: string,
    subject: string,
    context: {
      title: string;
      message: string;
      type: string;
      actionUrl?: string;
      actionLabel?: string;
    },
  ): Promise<void> {
    await this.sendMail(to, subject, 'generic-notification', {
      ...context,
      year: new Date().getFullYear(),
    });
  }
  /**
   * Envía un email de bienvenida al registrarse.
   */
  async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await this.sendMail(to, '¡Bienvenido a TrackiFly!', 'generic-notification', {
      title: `¡Hola, ${name}!`,
      message: 'Estamos muy felices de que te hayas unido a TrackiFly. Tu cuenta ha sido creada con éxito y ya puedes empezar a gestionar tus envíos.',
      type: 'success',
      actionUrl: process.env.FRONTEND_URL || 'https://trackifly.com',
      actionLabel: 'Ir al Dashboard',
      year: new Date().getFullYear(),
    });
  }
}
