import { id as rTracerId } from 'cls-rtracer';
import pino from 'pino';
import type { Logger } from 'pino';

import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';

import loggerConfig from './config/logger.config';

@Injectable()
export class PinoService {
  readonly logger: Logger;

  constructor(
    @Inject(loggerConfig.KEY)
    config: ConfigType<typeof loggerConfig>,
  ) {
    const isStdOut = !(config.dirname && config.filename);

    this.logger = pino(
      {
        level: config.level,
        mixin() {
          return { thread: rTracerId() };
        },
        prettyPrint:
          isStdOut && config.prettyPrint
            ? {
                colorize: true,
                levelFirst: true,
                translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
              }
            : undefined,
      },
      isStdOut
        ? undefined
        : pino.destination({ dest: `${config.dirname}/${config.filename}` }),
    );
  }
}
