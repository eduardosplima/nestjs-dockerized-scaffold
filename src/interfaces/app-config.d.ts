import type { DatabaseTypeEnum } from '../enums/database-type.enum';
import type { DbConfig } from './db-config';
import type { EnvConfig } from './env-config';
import type { SrcUncommentConfig } from './src-uncomment-config';

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

    src_uncomment: {
      [K in string]: SrcUncommentConfig;
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

    src_uncomment: {
      [K in string]: SrcUncommentConfig;
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

    src_uncomment: {
      [K in string]: SrcUncommentConfig;
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

    src_uncomment: {
      [K in string]: SrcUncommentConfig;
    };
  };

  tmpdir_prefix: string;
}
