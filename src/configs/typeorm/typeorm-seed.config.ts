import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfig } from './typeorm.config';

const typeormSeedConfig: TypeOrmModuleOptions = {
  ...new TypeOrmConfig().createTypeOrmOptions(),
  migrations: [join('src', 'database', 'seeds', '**', '*{.ts,.js}')],
  cli: {
    migrationsDir: join('src', 'database', 'seeds'),
  },
};

export default typeormSeedConfig;
