import { set } from 'mongoose';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import type { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import mongodbConfig from './config/mongodb.config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongodbConfig)],
      inject: [mongodbConfig.KEY],
      useFactory: (config: ConfigType<typeof mongodbConfig>) => {
        if (Logger.isLevelEnabled('debug')) {
          const logger = new Logger('Mongoose');
          set(
            'debug',
            (
              collectionName: string,
              methodName: string,
              ...methodArgs: any[]
            ): void => {
              logger.debug({ collectionName, methodName, methodArgs });
            },
          );
        }
        return config.options;
      },
    }),
  ],
})
export class MongodbModule {}
