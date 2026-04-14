import { PartialType } from '@nestjs/swagger';
//instale swagger
import { RegisterUserDto } from './register-user.dto';
import { IsOptional, IsUrl } from 'class-validator';

// partialType hace los campos opcionales automaticamente sin repetir nada
export class UpdateUserDto extends PartialType(RegisterUserDto) {
  //asi el usuario lo maneja al editar perfil
   @IsOptional()
  @IsUrl({}, { message: 'La imagen debe ser una URL válida' })
  image?: string;
}