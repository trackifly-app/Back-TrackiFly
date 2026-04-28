import { Body, Controller, Post, Get, Req, Res, UseGuards, ForbiddenException, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterOperatorDto } from './dto/register-operator.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { VerifyOtpDto } from '../notifications/dto/verify-otp.dto';
import { RequestPasswordResetDto } from '../notifications/dto/request-password-reset.dto';
import { ResetPasswordDto } from '../notifications/dto/reset-password.dto';
import { ResendOtpDto } from '../notifications/dto/resend-otp.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly isProd = process.env.NODE_ENV === 'production';

  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  @ApiOperation({ summary: 'Registro de usuario. Se envía OTP de verificación por email.' })
  @ApiResponse({ status: 201, description: 'Usuario registrado. Se envió código de verificación al email.' })
  async signUpUser(@Body() dto: RegisterUserDto) {
    const id = await this.authService.signUp(dto, Role.User);
    return {
      message: 'Usuario registrado exitosamente. Ya puedes iniciar sesión.',
      user_id: id,
    };
  }

  @Post('signup/company')
  @ApiOperation({ summary: 'Registro de empresa. Se envía OTP de verificación por email.' })
  @ApiResponse({ status: 201, description: 'Empresa registrada. Se envió código de verificación al email.' })
  async signUpCompany(@Body() dto: RegisterCompanyDto) {
    const id = await this.authService.signUp(dto, Role.Company);
    return {
      message: 'Empresa registrada exitosamente. Ya puedes iniciar sesión.',
      user_id: id,
    };
  }
 
  @Post('signin')
  @ApiOperation({ summary: 'Inicio de sesión con email y contraseña' })
  @ApiResponse({ status: 200, description: 'Login exitoso. Token JWT en cookie httpOnly.' })
  async signIn(@Body() credentials: LoginDto, @Res() res: Response) {
    const { token, message } = await this.authService.signIn(credentials);

    // Seteamos el token en una cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,                         // JS no puede leerla
      secure: this.isProd, // solo HTTPS en producción
      sameSite: this.isProd? 'none' : 'lax',                        // ← necesario para cookies cross-site con Railway y V
      maxAge: 1000 * 60 * 60 * 24 * 7,       // 7 días
    });

    return res.json({ message });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión (elimina cookie de token)' })
  logout(@Res() res: Response) {
    // Borramos la cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd? 'none' : 'lax',
    });
    return res.json({ message: 'Sesión cerrada exitosamente' });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Obtener datos del usuario autenticado' })
  getMe(@Req() req: Request & { user: { id: string; role: string; status: string } }) {
    // AuthGuard ya validó el token y puso el payload en req.user
    return req.user; // devuelve { id, role, status }
  }

  @UseGuards(AuthGuard)
  @Post('register-operator')
  @ApiOperation({ summary: 'Registrar operador (solo empresas)' })
  async registerOperator(
    @Req() req: Request & { user: { id: string; role: Role; status: string } }, 
    @Body() dto: RegisterOperatorDto) {
    if (req.user.role !== Role.Company) {
      throw new ForbiddenException('Solo empresas pueden registrar operadores');
    }
    const id = await this.authService.registerOperator(dto, req.user.id);
    return { message: 'Operador registrado exitosamente.', user_id: id };
  }

  @Post('google')
  @ApiOperation({ summary: 'Autenticación con Google' })
  async googleAuth(@Body() dto: GoogleAuthDto, @Res() res: Response) {
    const { token, message, isNew } = await this.authService.googleSignIn(dto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd? 'none' : 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ message, isNew });
  }

  // =============================================
  // VERIFICACIÓN & RECUPERACIÓN
  // =============================================

  /* 
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar email con código OTP de 6 dígitos' })
  @ApiResponse({ status: 200, description: 'Email verificado exitosamente.' })
  @ApiResponse({ status: 401, description: 'Código OTP inválido o expirado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async verifyEmail(@Body() dto: VerifyOtpDto) {
    await this.authService.verifyEmail(dto.email, dto.code);
    return { message: 'Email verificado exitosamente. Ya puedes iniciar sesión.' };
  }

  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña. Se envía OTP por email.' })
  @ApiResponse({ status: 200, description: 'Si el email existe, se envió un código de verificación.' })
  async requestPasswordReset(@Body() dto: RequestPasswordResetDto) {
    await this.authService.requestPasswordReset(dto.email);
    // Mensaje genérico por seguridad (no revelar si el email existe)
    return {
      message: 'Si el correo está registrado, recibirás un código de verificación en tu bandeja de entrada.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Restablecer contraseña con código OTP' })
  @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente.' })
  @ApiResponse({ status: 401, description: 'Código OTP inválido o expirado.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.email, dto.code, dto.newPassword);
    return { message: 'Contraseña restablecida exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.' };
  }

  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reenviar código OTP (máx. 3 cada 15 minutos)' })
  @ApiResponse({ status: 200, description: 'Código OTP reenviado al email.' })
  @ApiResponse({ status: 400, description: 'Límite de reenvíos excedido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async resendOtp(@Body() dto: ResendOtpDto) {
    await this.authService.resendOtp(dto.email, dto.type);
    return { message: 'Se ha enviado un nuevo código de verificación a tu correo electrónico.' };
  }
  */
}