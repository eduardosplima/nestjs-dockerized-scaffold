import { createSpinner } from 'nestjs-console';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { BuildEnvCommand } from '../impl/build-env.command';

@CommandHandler(BuildEnvCommand)
export class BuildEnvHandler
  implements ICommandHandler<BuildEnvCommand, string>
{
  async execute(command: BuildEnvCommand): Promise<string> {
    const { envConfigMap } = command;

    const spin = createSpinner();
    spin.start('Building .env');

    let result: string;
    try {
      const envLines: string[] = [];
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
