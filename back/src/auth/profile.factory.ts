import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Profile } from '../profiles/entities/profile.entity';
import { Company } from '../companies/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './types/register-dto.type';
import { Role } from '../common/enums/role.enum';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { RegisterOperatorDto } from './dto/register-operator.dto';
import { Gender } from '../common/enums/gender.enum';

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
        address: payload.address,
        phone: payload.phone,
        country: payload.country,
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
        address: payload.address,
        phone: payload.phone,
        country: payload.country,
        user: user,
      });
      await manager.save(company);
    });

    this.handlers.set(Role.Operator, async (dto, user, manager) => {
      const payload = dto as RegisterOperatorDto;
      const profile = manager.create(Profile, {
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: Gender.Other, // Default as operator doesn't supply it
        birthdate: new Date().toISOString(), // Default 
        address: payload.address,
        phone: payload.phone,
        country: payload.country,
        user: user,
      });
      await manager.save(profile);
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