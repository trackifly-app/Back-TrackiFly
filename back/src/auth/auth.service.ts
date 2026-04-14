import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UsersRepository } from '../user/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private readonly userRespository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}
  async singUp(newUserData: RegisterUserDto) {
    const { email, password } = newUserData;
    if (!email || !password)
      throw new NotFoundException('Email o password Incorrectos');
    const foundUser = await this.userRespository.getUserByEmail(email);
    if (foundUser)
      throw new BadRequestException(`El Usuario ya se encuentra registrado`);
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRespository.addUser({
      ...newUserData,
      password: hashedPassword,
    });
  }

  async singIn(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Email o password Incorrectos');
    }
    const foundUser = await this.userRespository.getUserByEmail(email);
    if (!foundUser) {
      throw new BadRequestException('Email o password Incorrectos');
    }
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      throw new BadRequestException('Email o password Incorrectos');
    }
    const payload = {
      id: foundUser.id,
      role: foundUser.role.name,
    };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Usuario Logeado',
      token: token,
    };
  }
}
