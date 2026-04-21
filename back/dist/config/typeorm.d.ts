import { DataSource } from 'typeorm';
export declare const typeOrmConfig: (() => {
    type: string;
    database: string | undefined;
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    autoLoadEntities: boolean;
    entities: string[];
    migrations: string[];
    logging: boolean;
    synchronize: boolean;
    dropSchema: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    database: string | undefined;
    host: string;
    port: number;
    username: string | undefined;
    password: string | undefined;
    autoLoadEntities: boolean;
    entities: string[];
    migrations: string[];
    logging: boolean;
    synchronize: boolean;
    dropSchema: boolean;
}>;
export declare const connectionSource: DataSource;
