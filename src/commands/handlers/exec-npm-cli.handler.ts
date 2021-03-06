import { createSpinner } from 'nestjs-console';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { execAsync } from '../../utils/exec-async.util';
import { ExecNpmCliCommand } from '../impl/exec-npm-cli.command';

@CommandHandler(ExecNpmCliCommand)
export class ExecNpmCliHandler
  implements ICommandHandler<ExecNpmCliCommand, void>
{
  async execute(command: ExecNpmCliCommand): Promise<void> {
    const { cmd, directory, parameters, spinText } = command;

    const spin = createSpinner();
    const cwd = process.cwd();
    process.chdir(directory);

    spin.start(spinText);
    try {
      await execAsync(`npm ${cmd} ${parameters?.join(' ')}`);
    } catch (err) {
      spin.fail();
      throw err;
    }
    spin.succeed();

    process.chdir(cwd);
  }
}
