import { Body, Controller, Post, Get, Req, Res, UseGuards, ForbiddenException } from '@nestjs/common';
import type { Response } from 'express';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterCompanyDto } from './dtos/register-company.dto';
import { RegisterOperatorDto } from './dtos/register-operator.dto';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from './guards/auth.guard';
import { GoogleAuthDto } from './dtos/google-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  async signUpUser(@Body() dto: RegisterUserDto) {
    const id = await this.authService.signUp(dto, Role.User);
    return { message: 'Usuario registrado exitosamente.', user_id: id };
  }

  @Post('signup/company')
  async signUpCompany(@Body() dto: RegisterCompanyDto) {
    const id = await this.authService.signUp(dto, Role.Company);
    return {
      message: 'Empresa registrada exitosamente. Cuenta pendiente de aprobación.',
      user_id: id,
    };
  }

  @Post('signin')
  async signIn(@Body() credentials: LoginDto, @Res() res: Response) {
    const { token, message } = await this.authService.signIn(credentials);

    // Seteamos el token en una cookie httpOnly
    res.cookie('token', token, {
      httpOnly: true,                         // JS no puede leerla
      secure: process.env.NODE_ENV === 'production', // solo HTTPS en producción
      sameSite: 'lax',                        // protección CSRF
      maxAge: 1000 * 60 * 60 * 24 * 7,       // 7 días
    });

    return res.json({ message });
  }

  @Post('logout')
  logout(@Res() res: Response) {
    // Borramos la cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return res.json({ message: 'Sesión cerrada exitosamente' });
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request & { user: { id: string; role: string; status: string } }) {
    // AuthGuard ya validó el token y puso el payload en req.user
    return req.user; // devuelve { id, role, status }
  }

  @UseGuards(AuthGuard)
  @Post('register-operator')
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
  async googleAuth(@Body() dto: GoogleAuthDto, @Res() res: Response) {
    const { token, message, isNew } = await this.authService.googleSignIn(dto);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ message, isNew });
  }
}