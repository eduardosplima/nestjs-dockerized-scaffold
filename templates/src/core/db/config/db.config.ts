import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('core-db-config', () => ({
  options: JSON.parse(process.env.DB_CONFIGURATION) as TypeOrmModuleOptions,
}));
