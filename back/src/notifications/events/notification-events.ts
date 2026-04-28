/**
 * Constantes de eventos de notificación.
 * Centralizadas para type-safety y evitar strings sueltos en el codebase.
 */
export const NOTIFICATION_EVENTS = {
  USER_REGISTERED: 'user.registered',
  PASSWORD_RESET_REQUESTED: 'user.password-reset-requested',
  OTP_RESEND_REQUESTED: 'user.otp-resend-requested',
  // Futuros eventos:
  // ORDER_SHIPPED: 'order.shipped',
  // PAYMENT_RECEIVED: 'payment.received',
  // ACCOUNT_APPROVED: 'user.account-approved',
} as const;

/**
 * Payload emitido cuando un usuario se registra.
 */
export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name?: string;
}

/**
 * Payload emitido cuando un usuario solicita reset de contraseña.
 */
export interface PasswordResetRequestedPayload {
  userId: string;
  email: string;
}

/**
 * Payload emitido cuando un usuario solicita reenvío de OTP.
 */
export interface OtpResendRequestedPayload {
  userId: string;
  email: string;
  type: 'email_verification' | 'password_reset';
}
