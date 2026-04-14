import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Roles, Users])],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}