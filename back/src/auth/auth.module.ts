import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../user/entities/users.entity';
import { UsersRepository } from '../user/users.repository';
import { Role } from '../roles/entities/roles.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Role])],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository],
})
export class AuthModule {}
