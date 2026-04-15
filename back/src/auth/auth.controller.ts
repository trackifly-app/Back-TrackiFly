import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterCompanyDto } from './dtos/register-company.dto';
import { LoginDto } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup/user')
  async signUpUser(@Body() dto: RegisterUserDto) {
    return this.authService.signUp(dto, Role.User);
  }

  @Post('signup/company')
  async signUpCompany(@Body() dto: RegisterCompanyDto) {
    return this.authService.signUp(dto, Role.Company);
  }

  @Post('signin')
  async signIn(@Body() credentials: LoginDto) {
    return this.authService.signIn(credentials);
  }
}
