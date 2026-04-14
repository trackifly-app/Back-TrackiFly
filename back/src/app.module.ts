import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { environment } from './config/environment';
import { RolesModule } from './roles/roles.module';
import { RolesService } from './roles/roles.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm')!,
    }),
    UsersModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor( private readonly rolesService: RolesService ) {}

  async onApplicationBootstrap() {
    await this.rolesService.seedRoles();
    console.log('Roles Cargados...')
    await this.rolesService.seedSuperAdmin();
    console.log('Usuario Super adminitrador Cargado...');
  }
}
