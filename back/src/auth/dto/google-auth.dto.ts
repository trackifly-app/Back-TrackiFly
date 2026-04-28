import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GoogleAuthDto {
  @IsEmail()
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @IsString()
  name: string;

  @IsString()
  googleId: string;

  @IsOptional()
  @IsString()
  picture?: string;
}

//registrarse con google 