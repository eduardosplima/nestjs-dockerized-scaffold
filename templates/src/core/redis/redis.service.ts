import type { Redis } from 'ioredis';
import IORedis from 'ioredis';

import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import redisConfig from './config/redis.config';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  readonly client: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    config: ConfigType<typeof redisConfig>,
  ) {
    const redis = new IORedis(config.options);

    this.client = Logger.isLevelEnabled('debug')
      ? new Proxy(redis, {
          get: (target, property) => {
            if (Object.prototype.hasOwnProperty.call(target, property))
              return target[property];

            return (...args: any[]): unknown => {
              this.logger.debug({
                command: property,
                args,
              });
              return target[property](...args);
            };
          },
        })
      : redis;
  }
}
