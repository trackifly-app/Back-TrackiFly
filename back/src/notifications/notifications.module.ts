import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/adapters/ejs.adapter';
import { join } from 'path';

import { environment } from '../config/environment';
import { OtpCode } from './entities/otp-code.entity';
import { OtpRepository } from './repositories/otp.repository';
import { OtpService } from './services/otp.service';
import { MailService } from './services/mail.service';
import { NotificationListenerService } from './listeners/notification-listener.service';

/**
 * Módulo de notificaciones.
 *
 * Centraliza toda la infraestructura de:
 * - Envío de emails (MailerModule + Gmail SMTP)
 * - Gestión de OTPs (generación, hash, verificación, limpieza)
 * - Escucha de eventos y despacho de notificaciones
 *
 * Exporta OtpService para que otros módulos (AuthModule) puedan verificar OTPs.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([OtpCode]),

    MailerModule.forRoot({
      transport: {
        host: environment.SMTP_HOST,
        port: environment.SMTP_PORT,
        secure: true,
        ignoreTLS: false,
        requireTLS: true,
        // Forzar IPv4 debido a problemas de conectividad IPv6 en Railway
        tls: { rejectUnauthorized: false },
        pool: true,
        maxConnections: 1,
        maxMessages: 10,
        ...({ family: 4 } as any),
        auth: {
          user: environment.SMTP_USER,
          pass: environment.SMTP_PASS,
        },
      },
      defaults: {
        from: environment.SMTP_FROM,
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
  ],
  providers: [
    OtpRepository,
    OtpService,
    MailService,
    NotificationListenerService,
  ],
  exports: [OtpService, MailService],
})
export class NotificationsModule {}
