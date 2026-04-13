import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private ormUsersRepository: Repository<Users>,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<Users, 'password'>[]> {
    const skip = (page - 1) * limit;
    const allUsers = await this.ormUsersRepository.find({
      skip: skip,
      take: limit,
    });
    return allUsers.map(({ password, ...userNoPassword }) => userNoPassword);
  }

  async getUserById(id: string): Promise<Omit<Users, 'password'>> {
    const foundUser = await this.ormUsersRepository.findOneBy({ id });
    if (!foundUser)
      throw new NotFoundException(`No se encontro el usuario con id: ${id}`);
    const { password, ...filteredUser } = foundUser;
    return filteredUser;
  }

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

  async updateUser(
    id: string,
    newDataUser: RegisterUserDto,
  ): Promise<Omit<Users, 'password'>> {
    const foundUser = await this.ormUsersRepository.findOneBy({ id });
    if (!foundUser)
      throw new NotFoundException(`No se encontro el usuario con id: ${id}`);
    if (newDataUser.email) {
      const existingUser = await this.ormUsersRepository.findOneBy({
        email: newDataUser.email,
      });
      if (existingUser && existingUser.id !== id)
        throw new ConflictException('El email ya está registrado');
    }
    const mergedUser = this.ormUsersRepository.merge(foundUser, newDataUser);
    const saveUser = await this.ormUsersRepository.save(mergedUser);
    const { password, ...filteredUser } = saveUser;
    return filteredUser;
  }
  //Se cambiara a borrado logico 
  async deleteUser(id: string): Promise<string> {
    const foundUser = await this.ormUsersRepository.findOneBy({ id });
    if (!foundUser)
      throw new NotFoundException(`No existe usuario con id ${id}`);
    await this.ormUsersRepository.remove(foundUser);
    return foundUser.id;
  }
}
