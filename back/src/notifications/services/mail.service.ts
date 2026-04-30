import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as ejs from 'ejs';
import { join } from 'path';
import { environment } from '../../config/environment';

/**
 * Servicio dedicado exclusivamente al envío de correos electrónicos.
 * Responsabilidad única: componer y despachar emails usando templates EJS.
 *
 * Soporta dos estrategias de envío:
 * - SMTP (vía @nestjs-modules/mailer) → para desarrollo local
 * - Resend HTTP API → para producción en Railway (donde SMTP está bloqueado)
 *
 * La estrategia se selecciona automáticamente según la variable RESEND_API_KEY.
 *
 * NO conoce la lógica de OTP, usuarios ni eventos.
 * Otros servicios le indican qué enviar.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resendApiKey = environment.RESEND_API_KEY;
  private readonly smtpFrom =
    environment.SMTP_FROM || 'TrackiFly <onboarding@resend.dev>';
  private readonly templatesDir = join(__dirname, '..', 'templates');

  constructor(private readonly mailerService: MailerService) {
    if (this.resendApiKey) {
      this.logger.log('📧 Modo de envío: Resend HTTP API');
    } else {
      this.logger.log('📧 Modo de envío: SMTP directo');
    }
  }

  /**
   * Envía un correo electrónico usando un template EJS.
   * Selecciona automáticamente SMTP o Resend según la configuración.
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
      if (this.resendApiKey) {
        await this.sendViaResend(to, subject, template, context);
      } else {
        await this.mailerService.sendMail({ to, subject, template, context });
      }
      this.logger.log(
        `Email enviado exitosamente a ${to} [template: ${template}]`,
      );
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
   * Envía el email a través de la API HTTP de Resend.
   * Renderiza el template EJS a HTML y lo envía vía fetch (puerto 443, nunca bloqueado).
   */
  private async sendViaResend(
    to: string,
    subject: string,
    template: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    // Renderizar el template EJS a HTML
    const templatePath = join(this.templatesDir, `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, context);

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.resendApiKey}`,
      },
      body: JSON.stringify({
        from: this.smtpFrom,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorBody}`);
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
      message:
        'Estamos muy felices de que te hayas unido a TrackiFly. Tu cuenta ha sido creada con éxito y ya puedes empezar a gestionar tus envíos.',
      type: 'success',
      year: new Date().getFullYear(),
    });
  }
}
