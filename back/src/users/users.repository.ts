import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormUsersRepository: Repository<User>,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    const skip = (page - 1) * limit;
    const users = await this.ormUsersRepository.find({
      skip,
      take: limit,
      relations: ['profile', 'company'],
    });
    return users.map(({ password, ...rest }) => rest);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.ormUsersRepository.findOne({
      where: { id },
      relations: ['profile', 'company'],
    });
    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
    }
    const { password, ...filtered } = user;
    return filtered;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.ormUsersRepository.findOne({
      where: { email },
      relations: ['role', 'profile', 'company'],
    });
  }

  async updateUser(
    id: string,
    updateData: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.ormUsersRepository.findOne({
      where: { id },
      relations: ['profile', 'company'],
    });
    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
    }
    const merged = this.ormUsersRepository.merge(user, updateData);
    const saved = await this.ormUsersRepository.save(merged);
    const { password, ...filtered } = saved;
    return filtered;
  }

  async softDeleteUser(id: string): Promise<string> {
    const user = await this.ormUsersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`No existe usuario con id: ${id}`);
    }
    user.is_active = false;
    await this.ormUsersRepository.save(user);
    return user.id;
  }
}
