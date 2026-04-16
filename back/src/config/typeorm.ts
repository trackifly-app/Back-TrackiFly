import { registerAs } from '@nestjs/config';
import { environment } from './environment';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/browser';

const config = {
  type: 'postgres',
  database: environment.DB_NAME,
  host: environment.DB_HOST,
  port: environment.DB_PORT as unknown as number,
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  autoLoadEntities: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: false,
  synchronize: true,
  dropSchema: true,
};

export const typeOrmConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
