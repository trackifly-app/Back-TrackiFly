import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Repository } from 'typeorm';
import { Role } from '../common/roles.enum';
import { Users } from '../user/entities/users.entity';
import * as bcrypt from 'bcrypt';
import { environment } from '../config/environment';
import { Gender } from '../common/gender.enum';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Roles) private ormRolesRepository: Repository<Roles>,
    @InjectRepository(Users) private ormUsersRepository: Repository<Users>,
  ) {}

  async seedRoles(): Promise<void> {
    const rolesToSeed = [Role.User, Role.Admin, Role.SuperAdmin];

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
        'Variables de entorno SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD no configuradas. No se creará el SuperAdmin.',
      );
      return;
    }

    const existingUser = await this.ormUsersRepository.findOneBy({ email });
    if (existingUser) {
      this.logger.warn(
        `El email ${email} ya está registrado. No se puede crear el SuperAdmin con ese email.`,
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = this.ormUsersRepository.create({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      phone: 0,
      country: 'System',
      address: 'System',
      gender: Gender.Other,
      birthdate: '1970-01-01',
      role: superAdminRole,
    });

    await this.ormUsersRepository.save(superAdmin);
    this.logger.log(`SuperAdmin creado con email: ${email}`);
  }
}
