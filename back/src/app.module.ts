import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnApplicationBootstrap,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { typeOrmConfig } from "./config/typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { ProfilesModule } from "./profiles/profiles.module";
import { CompaniesModule } from "./companies/companies.module";
import { AuthModule } from "./auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { environment } from "./config/environment";
import { RolesModule } from "./roles/roles.module";
import { RolesService } from "./roles/roles.service";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { OrdersModule } from "./orders/orders.module";
import { OrderDetailsModule } from "./order-details/order-details.module";

import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get("typeorm")!,
    }),
    UsersModule,
    ProfilesModule,
    CompaniesModule,
    AuthModule,
    JwtModule.register({
      global: true,
      secret: environment.JWT_SECRET,
      signOptions: {
        expiresIn: "7d",
      },
    }),
    RolesModule,
    OrdersModule,
    OrderDetailsModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule, OnApplicationBootstrap {
  constructor(private readonly rolesService: RolesService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
  async onApplicationBootstrap() {
    await this.rolesService.seedRoles();
    console.log("Roles Cargados...");
    await this.rolesService.seedSuperAdmin();
    console.log("Usuario Super administrador Cargado...");
  }
}
