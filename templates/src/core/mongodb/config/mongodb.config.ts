import { registerAs } from '@nestjs/config';
import type { MongooseModuleOptions } from '@nestjs/mongoose';

export default registerAs('core-mongodb-config', () => ({
  options: JSON.parse(process.env.DB_CONFIGURATION) as MongooseModuleOptions,
}));
