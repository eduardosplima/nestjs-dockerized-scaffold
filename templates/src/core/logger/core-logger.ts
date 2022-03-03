import { id as rTracerId } from 'cls-rtracer';
import { pino } from 'pino';
import type { Logger as PinoLogger } from 'pino';

import { Logger } from '@nestjs/common';
import type { LoggerService, LogLevel } from '@nestjs/common';

export class CoreLogger implements LoggerService {
  private readonly logger: PinoLogger;

  constructor() {
    const logLevel = process.env.LOGGER_LEVEL as LogLevel;
    const logFile =
      process.env.LOGGER_DIRNAME && process.env.LOGGER_FILENAME
        ? `${process.env.LOGGER_DIRNAME}/${process.env.LOGGER_FILENAME}`
        : undefined;
    const prettyPrint = process.env.LOGGER_PRETTY_PRINT === 'true';

    this.logger = pino(
      {
        customLevels: {
          log: 30,
          verbose: 10,
        },
        level: logLevel,
        mixin() {
          return { thread: rTracerId() };
        },
        transport:
          prettyPrint && !logFile
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                },
              }
            : undefined,
      },
      logFile ? pino.destination({ dest: logFile }) : undefined,
    );

    // Para que o método [Logger.isLevelEnabled] funcione corretamente,
    // é preciso definir os levels de log ativo para o Nest
    const logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
    Logger.overrideLogger(logLevels.slice(0, logLevels.indexOf(logLevel) + 1));
  }

  log(msg: string, ...args: any[]) {
    this.logger.info(msg, ...args);
  }

  error(msg: string, ...args: any[]) {
    this.logger.error(msg, ...args);
  }

  warn(msg: string, ...args: any[]) {
    this.logger.warn(msg, ...args);
  }

  debug(msg: string, ...args: any[]) {
    this.logger.debug(msg, ...args);
  }

  verbose(msg: string, ...args: any[]) {
    this.logger.trace(msg, ...args);
  }
}
