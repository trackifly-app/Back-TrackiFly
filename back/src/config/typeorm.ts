import { registerAs } from '@nestjs/config';
import { environment } from './environment';
import { DataSource, DataSourceOptions } from 'typeorm';

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
  dropSchema: false,
};

export const typeOrmConfig = registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
