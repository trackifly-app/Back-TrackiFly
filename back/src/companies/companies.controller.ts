import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { Company } from "./entities/company.entity";
import { UpdateCompanyDto } from "./dto/update-company.dto";

import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { UploadCompanyImageDto } from "./dto/upload-company-image.dto";
import { Buffer } from "buffer";

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
  async uploadCompanyImage(
    @Param("userId", ParseUUIDPipe) userId: string,
    @Body() body: UploadCompanyImageDto,
  ) {
    let result;
    if (body.imageBase64) {
      const buffer = Buffer.from(body.imageBase64, "base64");
      result = await this.cloudinaryService.uploadImage(buffer, {
        folder: "companies",
      });
    } else if (body.imageUrl) {
      result = await this.cloudinaryService.uploadImageFromUrl(body.imageUrl, {
        folder: "companies",
      });
    } else {
      return { error: "Debes enviar imageBase64 o imageUrl" };
    }
    // Aquí podrías guardar result.secure_url en la entidad Company
    return { url: result.secure_url };
  }
}
