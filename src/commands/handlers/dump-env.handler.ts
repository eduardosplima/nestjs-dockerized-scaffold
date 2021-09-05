import { createSpinner } from 'nestjs-console';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { DumpEnvCommand } from '../impl/dump-env.command';

@CommandHandler(DumpEnvCommand)
export class DumpEnvHandler implements ICommandHandler<DumpEnvCommand, string> {
  async execute(command: DumpEnvCommand): Promise<string> {
    const { envConfigMap, spinText } = command;

    const spin = createSpinner();
    spin.start(spinText);

    let result: string;
    try {
      const envLines: Array<string> = [];
      envConfigMap.forEach((envConfig, envName) => {
        if (envConfig.lineSeparator) {
          envLines.push('');
        }
        if (envConfig.comment) {
          envLines.push(`# ${envConfig.comment}`);
        }
        if (!(envConfig.hideIfNull && !envConfig.value)) {
          let line = `${envName}=${envConfig.value}`;
          if (envConfig.lineCommented) {
            line = `# ${line}`;
          }
          envLines.push(line);
        }
      });

      result = envLines.join('\n');
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
    return result;
  }
}
