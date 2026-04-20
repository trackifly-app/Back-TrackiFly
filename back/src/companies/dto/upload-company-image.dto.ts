import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class UploadCompanyImageDto {
  @IsOptional()
  @IsString()
  imageBase64?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
