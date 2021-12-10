import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PinoService } from '../logger/pino.service';
import dbConfig from './config/db.config';
import { TypeOrmLoggerService } from './type-orm-logger.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(dbConfig)],
      inject: [dbConfig.KEY, PinoService],
      useFactory: (
        config: ConfigType<typeof dbConfig>,
        pinoService: PinoService,
      ) => ({
        ...config.options,
        entities: [
          resolve(__dirname, '..', '..', '**/entities/**/*.entity.{js,ts}'),
        ],
        logging: pinoService.logger.isLevelEnabled('debug'),
        logger: new TypeOrmLoggerService(
          pinoService.logger.child({ context: 'TypeOrm' }),
        ),
      }),
    }),
  ],
})
export class DbModule {}
