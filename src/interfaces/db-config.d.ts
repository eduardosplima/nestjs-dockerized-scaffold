import type { EnvConfig } from './env-config';
import type { SrcUncommentConfig } from './src-uncomment-config';

export interface DbConfig {
  docker: {
    dockerfile: string;
    compose?: Record<string, unknown>;
  };

  npm: {
    install: string[];
    install_dev: string[];
  };

  env_file: {
    [K in string]: EnvConfig;
  };

  src_uncomment: {
    [K in string]: SrcUncommentConfig;
  };
}
