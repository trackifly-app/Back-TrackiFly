import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './types/register-dto.type';
import { Role } from '../common/enums/role.enum';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterCompanyDto } from './dtos/register-company.dto';

type ProfileHandler = (dto: RegisterDto, user: User, manager: EntityManager) => Promise<void>;

@Injectable()
export class ProfileFactory {
  private readonly handlers = new Map<Role, ProfileHandler>();

  constructor() {
    this.handlers.set(Role.User, async (dto, user, manager) => {
      const payload = dto as RegisterUserDto;
      const profile = manager.create(Profile, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        birthdate: payload.birthdate,
        user: user,
      });
      await manager.save(profile);
    });

    this.handlers.set(Role.Company, async (dto, user, manager) => {
      const payload = dto as RegisterCompanyDto;
      const company = manager.create(Company, {
        company_name: payload.company_name,
        industry: payload.industry,
        contact_name: payload.contact_name,
        plan: payload.plan,
        user: user,
      });
      await manager.save(company);
    });

    this.handlers.set(Role.Operator, async (dto, user, manager) => {
      // El operador hereda el modelo User sin datos extendidos en otras tablas por el momento
      return Promise.resolve();
    });
  }

  async createByRole(
    role: Role,
    dto: RegisterDto,
    user: User,
    manager: EntityManager,
  ): Promise<void> {
    const handler = this.handlers.get(role);
    
    if (!handler) {
      throw new BadRequestException(
        `No existe una estrategia valida para crear el perfil del rol: ${role}`,
      );
    }

    await handler(dto, user, manager);
  }
}