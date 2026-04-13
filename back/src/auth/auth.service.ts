import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { UsersRepository } from '../user/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../user/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRespository: UsersRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}
  async singUp(newUserData: RegisterUserDto) {
    const { email, password, roleId, ...rest } = newUserData;
    if (!email || !password)
      throw new NotFoundException('Email o password Incorrectos');
    const foundUser = await this.userRespository.getUserByEmail(email);
    if (foundUser)
      throw new BadRequestException(`El Usuario ya se encuentra registrado`);
    const role = roleId
      ? await this.roleRepository.findOneBy({ id: roleId })
      : await this.roleRepository.findOne({ where: { name: 'cliente' } });
    if (!role) {
      throw new BadRequestException('El rol no existe');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userRespository.addUser({
      ...rest,
      email,
      password: hashedPassword,
      role,
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
      role: foundUser.role?.name ?? 'cliente',
    };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Usuario Logeado',
      token: token,
    };
  }
}
