import { PartialType } from '@nestjs/swagger';
//instale swagger
import { RegisterUserDto } from './register-user.dto';

// partialType hace los campos opcionales automaticamente sin repetir nada
export class UpdateUserDto extends PartialType(RegisterUserDto) {}