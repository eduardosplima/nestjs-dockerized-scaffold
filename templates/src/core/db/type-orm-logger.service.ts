import { QueryRunner } from 'typeorm';
import type { Logger as TypeOrmLogger } from 'typeorm';

import { Logger } from '@nestjs/common';

export class TypeOrmLoggerService implements TypeOrmLogger {
  private readonly logger = new Logger('TypeOrm');

  logQuery(
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.debug({
      connection: queryRunner?.connection?.name,
      parameters,
      query,
    });
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.error({
      connection: queryRunner?.connection?.name,
      parameters,
      query,
      error: (error as Error)?.message || error,
    });
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: unknown[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.warn({
      connection: queryRunner?.connection?.name,
      parameters,
      query,
      time,
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner): void {
    this.logger.log({ connection: queryRunner?.connection?.name, message });
  }

  logMigration(message: string, queryRunner?: QueryRunner): void {
    this.logger.log({ connection: queryRunner?.connection?.name, message });
  }

  log(
    level: Parameters<TypeOrmLogger['log']>[0],
    message: unknown,
    queryRunner?: QueryRunner,
  ): void {
    this.logger.log({
      level,
      connection: queryRunner?.connection?.name,
      message,
    });
  }
}
