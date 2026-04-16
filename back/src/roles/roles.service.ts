import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { EntityManager, Repository } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { environment } from '../config/environment';
import {
  getSeedableRoles,
  isSelfSignUpRole,
} from './constants/role-catalog.constant';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Roles) private ormRolesRepository: Repository<Roles>,
    @InjectRepository(User) private ormUsersRepository: Repository<User>,
  ) {}

  async getRoleByName(
    roleName: Role,
    manager?: EntityManager,
  ): Promise<Roles | null> {
    if (manager) {
      return manager.findOne(Roles, {
        where: { name: roleName },
      });
    }

    return this.ormRolesRepository.findOne({
      where: { name: roleName },
    });
  }

  isSelfSignUpAllowed(roleName: Role): boolean {
    return isSelfSignUpRole(roleName);
  }

  async seedRoles(): Promise<void> {
    const rolesToSeed = getSeedableRoles();

    for (const roleName of rolesToSeed) {
      const existingRole = await this.ormRolesRepository.findOneBy({
        name: roleName,
      });
      if (!existingRole) {
        const newRole = this.ormRolesRepository.create({ name: roleName });
        await this.ormRolesRepository.save(newRole);
      }
    }
  }

  async seedSuperAdmin(): Promise<void> {
    const superAdminRole = await this.ormRolesRepository.findOneBy({
      name: Role.SuperAdmin,
    });
    if (!superAdminRole) {
      this.logger.error(
        'El rol SuperAdmin no existe. Ejecuta seedRoles() primero.',
      );
      return;
    }

    const existingSuperAdmin = await this.ormUsersRepository.findOne({
      where: { role: { name: Role.SuperAdmin } },
      relations: { role: true },
    });

    if (existingSuperAdmin) {
      this.logger.log('Ya existe un SuperAdmin. No se creará otro.');
      return;
    }

    const email = environment.SUPERADMIN_EMAIL;
    const password = environment.SUPERADMIN_PASSWORD;

    if (!email || !password) {
      this.logger.warn(
        'Variables de entorno SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD no configuradas.',
      );
      return;
    }

    const existingUser = await this.ormUsersRepository.findOneBy({ email });
    if (existingUser) {
      this.logger.warn(
        `El email ${email} ya está registrado. No se puede crear el SuperAdmin.`,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // SuperAdmin es solo identidad, sin perfil asociado
    const superAdmin = this.ormUsersRepository.create({
      email,
      password: hashedPassword,
      phone: '0000000000',
      country: 'XX',
      address: 'System',
      role: superAdminRole,
    });

    await this.ormUsersRepository.save(superAdmin);
    this.logger.log(`SuperAdmin creado con email: ${email}`);
  }
}
