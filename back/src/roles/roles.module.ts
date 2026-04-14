import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { Users } from '../user/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Users])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}