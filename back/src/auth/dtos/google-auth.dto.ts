import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsEmail()
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