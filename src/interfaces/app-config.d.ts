import { DatabaseTypeEnum } from '../enums/database-type.enum';
import type { DbConfig } from './db-config';
import type { EnvConfig } from './env-config';

export interface AppConfig {
  commom: {
    docker_compose: Record<string, unknown>;

    npm: {
      install: Array<string>;
      install_dev: Array<string>;
      uninstall: Array<string>;
    };

    env_file: {
      [K in string]: EnvConfig;
    };
  };

  database: {
    [K in DatabaseTypeEnum]: DbConfig;
  };

  jwt: {
    npm: {
      install: Array<string>;
      install_dev: Array<string>;
    };

    env_file: {
      [K in string]: EnvConfig;
    };
  };

  redis: {
    docker_compose: Record<string, unknown>;

    npm: {
      install: Array<string>;
      install_dev: Array<string>;
    };

    env_file: {
      [K in string]: EnvConfig;
    };
  };

  email: {
    docker_compose: Record<string, unknown>;

    npm: {
      install: Array<string>;
      install_dev: Array<string>;
    };

    env_file: {
      [K in string]: EnvConfig;
    };
  };

  prometheus: {
    docker_compose: Record<string, unknown>;

    npm: {
      install: Array<string>;
      install_dev: Array<string>;
    };

    env_file: {
      [K in string]: EnvConfig;
    };
  };

  tmpdir_prefix: string;
}
