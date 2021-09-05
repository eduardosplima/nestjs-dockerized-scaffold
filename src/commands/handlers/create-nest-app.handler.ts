import { createSpinner } from 'nestjs-console';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { execAsync } from '../../utils/exec-async.util';
import { CreateNestAppCommand } from '../impl/create-nest-app.command';

@CommandHandler(CreateNestAppCommand)
export class CreateNestAppHandler
  implements ICommandHandler<CreateNestAppCommand, void>
{
  async execute(command: CreateNestAppCommand): Promise<void> {
    const { appName, directory } = command;

    const spin = createSpinner();
    const cwd = process.cwd();
    process.chdir(directory);

    spin.start('Fetching latest nest-cli');
    try {
      await execAsync('npm i @nestjs/cli');
    } catch (err) {
      spin.fail();
      throw err;
    }
    spin.succeed();

    spin.start('Creating nest application');
    try {
      await execAsync(
        `./node_modules/.bin/nest new --skip-git --package-manager npm ${appName}`,
      );
    } catch (err) {
      spin.fail();
      throw err;
    }
    spin.succeed();

    process.chdir(cwd);
  }
}
