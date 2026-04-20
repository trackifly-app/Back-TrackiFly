import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesRepository {
  constructor(
    @InjectRepository(Profile)
    private readonly ormProfilesRepository: Repository<Profile>,
  ) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.ormProfilesRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    if (!profile) {
      throw new NotFoundException(
        `No se encontró perfil para el usuario con id: ${userId}`,
      );
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    const merged = this.ormProfilesRepository.merge(profile, updateData);
    return this.ormProfilesRepository.save(merged);
  }
}
