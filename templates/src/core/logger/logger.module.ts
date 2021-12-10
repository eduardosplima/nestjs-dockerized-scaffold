import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import loggerConfig from './config/logger.config';
import { LoggerService } from './logger.service';
import { PinoService } from './pino.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(loggerConfig)],
  providers: [PinoService, LoggerService],
  exports: [PinoService, LoggerService],
})
export class LoggerModule {}
