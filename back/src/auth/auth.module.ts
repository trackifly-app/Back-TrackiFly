import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/user.entity';
import { UsersRepository } from '../user/user.repository';
import { Role } from '../user/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role])],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
