// Controlador para exponer los endpoints REST de usuario.
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

/**
 * Controlador de usuario: expone los endpoints REST para gestionar usuarios.
 * Cada endpoint llama a un método del servicio.
 */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint para crear un usuario (POST /users)
   */
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Endpoint para obtener todos los usuarios (GET /users)
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Endpoint para obtener un usuario por ID (GET /users/:id)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * Endpoint para actualizar un usuario (PATCH /users/:id)
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Endpoint para eliminar un usuario (DELETE /users/:id)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
