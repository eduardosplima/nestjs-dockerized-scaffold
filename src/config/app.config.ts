import { readFileSync } from 'fs';
import { load as loadYaml } from 'js-yaml';
import { join } from 'path';

import { registerAs } from '@nestjs/config';

import type { AppConfig } from '../interfaces/app-config';

const YAML_CONFIG_FILENAME = 'config.yml';

export default registerAs(
  'app-config',
  () =>
    loadYaml(
      readFileSync(join(__dirname, '..', '..', YAML_CONFIG_FILENAME), 'utf8'),
    ) as AppConfig,
);
