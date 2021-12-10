import IORedis from 'ioredis';
import type { Redis } from 'ioredis';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import { LoggerService } from '../logger/logger.service';
import redisConfig from './config/redis.config';

@Injectable()
export class RedisService {
  readonly client: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    config: ConfigType<typeof redisConfig>,
    logger: LoggerService,
  ) {
    logger.setContext(RedisService.name);
    const redis = new IORedis(config.options);

    this.client = logger.isLevelEnabled('debug')
      ? new Proxy(redis, {
          get: (target, property) => {
            if (Object.prototype.hasOwnProperty.call(target, property))
              return target[property];

            return (...args: any[]): unknown => {
              logger.debug({
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
