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
import { User } from './entities/user.entity';
import { UserStatus } from '../common/enums/user-status.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Omit<User, 'password'>[]> {
    const numPage = Number(page);
    const numLimit = Number(limit);
    const validPage = !isNaN(numPage) && numPage > 0 ? numPage : 1;
    const validLimit = !isNaN(numLimit) && numLimit > 0 ? numLimit : 5;
    return this.usersService.getAllUsers(validPage, validLimit);
  }

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.getUserById(id);
  }

  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const deletedId = await this.usersService.deleteUser(id);
    return {
      message: 'Usuario eliminado exitosamente.',
      user_id: deletedId,
    };
  }

  @Put(':id/status')
  async changeUserStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: UserStatus,
  ) {
    const updatedUser = await this.usersService.changeUserStatus(id, status);
    return {
      message: `El estado del usuario ha sido actualizado correctamente.`,
      user_id: updatedUser.id,
      status: updatedUser.status,
    };
  }

  @Put(':id/role-admin')
  async makeAdmin(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const updatedUser = await this.usersService.makeAdmin(id);
    return {
      message: 'El usuario ha sido promovido a administrador.',
      user_id: updatedUser.id,
    };
  }
}
