import type { EnvConfig } from './env-config';

export interface DbConfig {
  docker: {
    dockerfile: string;
    compose?: Record<string, unknown>;
  };

  npm: {
    install: Array<string>;
    install_dev: Array<string>;
  };

  env_file: {
    [K in string]: EnvConfig;
  };
}
