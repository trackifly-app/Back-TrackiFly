import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singUp(@Body() newUserData: RegisterUserDto) {
    return await this.authService.singUp(newUserData);
  }

  @Post('signin')
  async singIn(@Body() credentials: LoginDto) {
    const { email, password } = credentials;
    return await this.authService.singIn(email, password);
  }
}
