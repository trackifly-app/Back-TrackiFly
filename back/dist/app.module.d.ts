import { MiddlewareConsumer, NestModule, OnApplicationBootstrap } from "@nestjs/common";
import { RolesService } from "./roles/roles.service";
export declare class AppModule implements NestModule, OnApplicationBootstrap {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    configure(consumer: MiddlewareConsumer): void;
    onApplicationBootstrap(): Promise<void>;
}
