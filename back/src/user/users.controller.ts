import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Omit<Users, 'password'>[]> {
    const numPage = Number(page);
    const numLimit = Number(limit);
    const validPage = !isNaN(numPage) && numPage > 0 ? numPage : 1;
    const validLimit = !isNaN(numLimit) && numLimit > 0 ? numLimit : 5;

    return await this.usersService.getAllUsers(validPage, validLimit);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<Users, 'password'>> {
    return await this.usersService.getUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newUserData: RegisterUserDto,
  ): Promise<Omit<Users, 'password'>> {
    return await this.usersService.updateUser(id, newUserData);
  }

  //Se cambiara por borrado Logico
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.usersService.deleteUser(id);
  }
}
