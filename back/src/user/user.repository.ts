import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private ormUsersRepository: Repository<Users>,
  ) {}

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.ormUsersRepository.findOne({
      where: { email },
      relations: { role: true },
    });
  }

  async addUser(newUserData: Partial<Users>): Promise<string> {
    const user = this.ormUsersRepository.create(newUserData);
    const saveUser = await this.ormUsersRepository.save(user);
    return saveUser.id;
  }
}
