import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });
export const environment = {
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,

  DB_NAME: process.env.DB_NAME,

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 5432,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,

  JWT_SECRET: process.env.JWT_SECRET,
  
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL,
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD,

    // MercadoPago
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  MP_WEBHOOK_SECRET: process.env.MP_WEBHOOK_SECRET,
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Email SMTP (Gmail)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: Number(process.env.SMTP_PORT) || 465,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,

  // OTP / Notificaciones
  AUTH_SECRET: process.env.AUTH_SECRET,

  // Brevo (Estrategia HTTP para Railway sin dominio propio)
  BREVO_API_KEY: process.env.BREVO_API_KEY,
};
