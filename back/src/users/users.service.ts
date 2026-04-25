import { Injectable, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { UserStatus } from '../common/enums/user-status.enum';
import { RolesService } from '../roles/roles.service';
import { Role } from '../common/enums/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '../auth/guards/auth.guard';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly rolesService: RolesService,
    @InjectRepository(User)
    private readonly ormUsersRepository: Repository<User>,
  ) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<Omit<User, 'password'>[]> {
    return this.usersRepository.getAllUsers(page, limit);
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    return this.usersRepository.getUserById(id);
  }

  @UseGuards(AuthGuard)
  async deleteUser(id: string): Promise<string> {
    return this.usersRepository.softDeleteUser(id);
  }

  async changeUserStatus(id: string, status: UserStatus): Promise<Omit<User, 'password'>> {
    return this.usersRepository.changeUserStatus(id, status);
  }

  async makeAdmin(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.ormUsersRepository.findOne({
      where: { id, is_active: true },
      relations: ['role', 'profile', 'company'],
    });
    if (!user) {
      throw new NotFoundException(`No se encontró el usuario con id: ${id}`);
    }

    if (user.role.name === Role.Admin || user.role.name === Role.SuperAdmin) {
      throw new BadRequestException('El usuario ya tiene un rol de administrador');
    }

    const adminRole = await this.rolesService.getRoleByName(Role.Admin);
    if (!adminRole) {
      throw new BadRequestException('El rol Admin no existe en la base de datos');
    }

    user.role = adminRole;
    const saved = await this.ormUsersRepository.save(user);
    const { password, ...filtered } = saved;
    return filtered;
  }
}
