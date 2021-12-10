import type { Logger as PinoLogger } from 'pino';
import { QueryRunner } from 'typeorm';
import type { Logger as TypeOrmLogger } from 'typeorm';

export class TypeOrmLoggerService implements TypeOrmLogger {
  constructor(private readonly logger: PinoLogger) {}

  logQuery(
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.debug(
      { connection: queryRunner?.connection?.name, parameters, query },
      'query',
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.error(
      {
        connection: queryRunner?.connection?.name,
        parameters,
        query,
        error: (error as Error)?.message || error,
      },
      'queryError',
    );
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.warn(
      { connection: queryRunner?.connection?.name, parameters, query, time },
      'querySlow',
    );
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.logger.info(
      { connection: queryRunner?.connection?.name, message },
      'schemaBuild',
    );
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.logger.info(
      { connection: queryRunner?.connection?.name, message },
      'migration',
    );
  }

  log(
    level: Parameters<TypeOrmLogger['log']>[0],
    message: unknown,
    queryRunner?: QueryRunner,
  ): void {
    this.logger[level](
      { connection: queryRunner?.connection?.name, message },
      'log',
    );
  }
}
