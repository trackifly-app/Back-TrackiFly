import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entities/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    return await this.usersRepository.getAllUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<Users, 'password'>> {
    return await this.usersRepository.getUserById(id);
  }

  async updateUser(
    id: string,
    newDataUser: RegisterUserDto,
  ): Promise<Omit<Users, 'password'>> {
    return await this.usersRepository.updateUser(id, newDataUser);
  }

  //Se cambiara ha borrado logico
  async deleteUser(id: string): Promise<string> {
    return await this.usersRepository.deleteUser(id);
  }
}
