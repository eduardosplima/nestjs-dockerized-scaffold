import type { LogFn, Logger } from 'pino';

import { Injectable, Scope } from '@nestjs/common';
import type { LoggerService as ILoggerService } from '@nestjs/common';

import { PinoService } from './pino.service';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILoggerService {
  private logger: Logger;

  private setup(logger: Logger): void {
    this.logger = logger;

    this.debug = logger.debug.bind(this.logger);
    this.error = logger.error.bind(this.logger);
    this.log = logger.info.bind(this.logger);
    this.verbose = logger.trace.bind(this.logger);
    this.warn = logger.warn.bind(this.logger);

    this.isLevelEnabled = logger.isLevelEnabled.bind(this.logger);
  }

  constructor(pinoService: PinoService) {
    this.setup(pinoService.logger);
  }

  setContext(
    context: string,
    level?: 'error' | 'warn' | 'info' | 'debug' | 'trace',
  ): void {
    this.setup(this.logger.child({ context }, { level }));
  }

  debug: LogFn;

  error: LogFn;

  log: LogFn;

  verbose: LogFn;

  warn: LogFn;

  isLevelEnabled: (
    level: 'error' | 'warn' | 'info' | 'debug' | 'trace',
  ) => boolean;
}
