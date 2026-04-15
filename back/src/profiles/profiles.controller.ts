import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('user/:userId')
  async getProfileByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<Profile> {
    return this.profilesService.getProfileByUserId(userId);
  }

  @Put('user/:userId')
  async updateProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateData: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.updateProfile(userId, updateData);
  }
}
