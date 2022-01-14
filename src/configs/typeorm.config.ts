import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { join } from 'path';

@Injectable()
export class TypeOrmConfig implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    return {
      type: 'postgres',
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT) || 5432,
      database: process.env.TYPEORM_DATABASE,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      entities: [join(__dirname, '..', 'modules', '**', '*.entity{.ts,.js}')],
      synchronize: true,
      // migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
      // cli: {
      //   migrationsDir: 'src/database/migrations',
      // },
    };
  }
}
