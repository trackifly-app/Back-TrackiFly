import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { ProfileFactory } from './profile.factory';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [UsersModule, RolesModule, NotificationsModule],
  controllers: [AuthController],
  providers: [AuthService, ProfileFactory],
})
export class AuthModule {}
