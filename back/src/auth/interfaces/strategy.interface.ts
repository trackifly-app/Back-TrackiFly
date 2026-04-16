import { EntityManager } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RegisterDto } from '../types/register-dto.type';

export interface ProfileCreationStrategy {
  condition: (payload: RegisterDto) => boolean;
  action: (
    payload: RegisterDto,
    user: User,
    manager: EntityManager,
  ) => Promise<void>;
}