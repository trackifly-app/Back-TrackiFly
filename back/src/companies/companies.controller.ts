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
import { CompaniesService } from "./companies.service";
import { Company } from "./entities/company.entity";
import { UpdateCompanyDto } from "./dto/update-company.dto";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("companies")
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get("user/:userId")
  async getCompanyByUserId(
    @Param("userId", ParseUUIDPipe) userId: string,
  ): Promise<Company> {
    return this.companiesService.getCompanyByUserId(userId);
  }

  @Put("user/:userId")
  async updateCompany(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() updateData: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companiesService.updateCompany(userId, updateData);
  }

  @Put("user/:userId/image")
  @UseInterceptors(FileInterceptor('image'))
  async uploadCompanyImage(
    @Param("userId", ParseUUIDPipe) userId: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException("No se ha enviado ninguna imagen");
    }

    const result = await this.cloudinaryService.uploadImage(file.buffer, {
      folder: "companies",
    });

    const updatedCompany = await this.companiesService.updateCompanyImage(
      userId,
      result.secure_url,
    );

    return { 
      message: "Imagen actualizada correctamente", 
      url: updatedCompany.profile_image 
    };
  }
}
