import type { DatabaseTypeEnum } from '../enums/database-type.enum';

export interface NewProjectOptions {
  description?: string;

  port: number;

  debugPort: number;

  setupJwt: boolean;

  setupDatabase?: DatabaseTypeEnum;

  setupRedis: boolean;

  setupEmail: boolean;

  setupPrometheus: boolean;

  skipDatabaseContainer: boolean;

  skipRedisContainer: boolean;

  skipEmailContainer: boolean;

  skipPrometheusContainer: boolean;
}
