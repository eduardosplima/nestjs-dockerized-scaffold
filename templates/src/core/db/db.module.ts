import { resolve } from 'path';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import dbConfig from './config/db.config';
import { TypeOrmLoggerService } from './type-orm-logger.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [dbConfig.KEY],
      useFactory: (config: ConfigType<typeof dbConfig>) => ({
        ...config.options,
        entities: [
          resolve(__dirname, '..', '..', '**/entities/**/*.entity.{js,ts}'),
        ],
        logger: Logger.isLevelEnabled('debug')
          ? new TypeOrmLoggerService()
          : undefined,
      }),
    }),
  ],
})
export class DbModule {}
