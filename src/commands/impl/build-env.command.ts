import type { EnvConfig } from '../../interfaces/env-config';

export class BuildEnvCommand {
  constructor(public readonly envConfigMap: Map<string, EnvConfig>) {}
}
