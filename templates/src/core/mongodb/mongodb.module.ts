import { set } from 'mongoose';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { LoggerModule } from '../logger/logger.module';
import { PinoService } from '../logger/pino.service';
import mongodbConfig from './config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongodbConfig), LoggerModule],
      inject: [mongodbConfig.KEY, PinoService],
      useFactory: (
        config: ConfigType<typeof mongodbConfig>,
        pinoService: PinoService,
      ) => {
        if (pinoService.logger.isLevelEnabled('debug')) {
          const logger = pinoService.logger.child({ context: 'Mongoose' });
          set(
            'debug',
            (
              collectionName: string,
              methodName: string,
              ...methodArgs: Array<any>
            ): void => {
              logger.debug(
                { collectionName, methodName, methodArgs },
                'MongoDB operation',
              );
            },
          );
        }
        return {
          ...config.options,
          useFindAndModify: false,
        };
      },
    }),
  ],
})
export class MongodbModule {}
