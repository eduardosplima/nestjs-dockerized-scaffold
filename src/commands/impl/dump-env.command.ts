import type { EnvConfig } from '../../interfaces/env-config';

export class DumpEnvCommand {
  constructor(
    public readonly envConfigMap: Map<string, EnvConfig>,
    public readonly spinText: string,
  ) {}
}
