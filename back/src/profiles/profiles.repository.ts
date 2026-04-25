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
    if (profile.user) {
      delete (profile.user as any).password;
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    updateData: UpdateProfileDto,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    const merged = this.ormProfilesRepository.merge(profile, updateData);
    const saved = await this.ormProfilesRepository.save(merged);
    if (saved.user) {
      delete (saved.user as any).password;
    }
    return saved;
  }

  async updateProfileImage(
    userId: string,
    profile_image: string,
  ): Promise<Profile> {
    const profile = await this.getProfileByUserId(userId);
    profile.profile_image = profile_image;
    const saved = await this.ormProfilesRepository.save(profile);
    if (saved.user) {
      delete (saved.user as any).password;
    }
    return saved;
  }
}
