import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../common/enums/user-status.enum';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.getAllUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    return this.usersRepository.getUserById(id);
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    return this.usersRepository.updateUser(id, updateData);
  }

  async deleteUser(id: string): Promise<string> {
    return this.usersRepository.softDeleteUser(id);
  }

  async changeUserStatus(id: string, status: UserStatus): Promise<Omit<User, 'password'>> {
    return this.usersRepository.changeUserStatus(id, status);
  }
}
