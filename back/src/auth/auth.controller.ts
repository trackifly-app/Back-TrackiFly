import { Body, Controller, Post, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterCompanyDto } from './dtos/register-company.dto';
import { RegisterOperatorDto } from './dtos/register-operator.dto';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  async signUpUser(@Body() dto: RegisterUserDto) {
    const id = await this.authService.signUp(dto, Role.User);
    return {
      message: 'Usuario registrado exitosamente.',
      user_id: id,
    };
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
  async signIn(@Body() credentials: LoginDto) {
    return this.authService.signIn(credentials);
  }

  @UseGuards(AuthGuard)
  @Post('register-operator')
  async registerOperator(@Req() req: any, @Body() dto: RegisterOperatorDto) {
    if (req.user.role !== Role.Company) {
      throw new ForbiddenException('Solo empresas pueden registrar operadores');
    }
    const id = await this.authService.registerOperator(dto, req.user.id);
    return {
      message: 'Operador registrado exitosamente.',
      user_id: id,
    };
  }
}
