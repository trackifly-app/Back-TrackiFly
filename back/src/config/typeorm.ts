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
  //entities: ['dist/**/*.entity{.ts,.js}'],
  entities: [__dirname + '/../entities/*.entity.{ts,js}', 'dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  logging: false,
  synchronize: true,
  dropSchema: false,
};



console.log('TypeORM config:', config); // <-- Agrega esta línea aquí

export const typeOrmConfig = registerAs('typeorm', () => config);
// La línea siguiente es necesaria para poder correr las migraciones
// desde la terminal con el comando: npm run typeorm migration:run
export const connectionSource = new DataSource(config as DataSourceOptions);
