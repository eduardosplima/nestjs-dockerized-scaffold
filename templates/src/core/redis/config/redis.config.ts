import { RedisOptions } from 'ioredis';

import { registerAs } from '@nestjs/config';

export default registerAs('core-redis-config', () => ({
  options: JSON.parse(process.env.REDIS_CONFIGURATION) as RedisOptions,
}));
