import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ProfilesService } from "./profiles.service";
import { Profile } from "./entities/profile.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("profiles")
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("user/:userId")
  async getProfileByUserId(
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<Profile> {
    return this.profilesService.getProfileByUserId(userId);
  }

  @Put("user/:userId")
  async updateProfile(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateData: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profilesService.updateProfile(userId, updateData);
  }
  @Put("user/:userId/image")
  @UseInterceptors(FileInterceptor("image"))
  async uploadProfileImage(
    @Param("userId", ParseUUIDPipe) userId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException("No se ha enviado ninguna imagen");
    }

    const result = await this.cloudinaryService.uploadImage(file.buffer, {
      folder: "profiles",
    });

    const updatedProfile = await this.profilesService.updateProfileImage(
      userId,
      result.secure_url,
    );

    return {
      message: "Imagen actualizada correctamente",
      url: updatedProfile.profile_image,
    };
  }
}
