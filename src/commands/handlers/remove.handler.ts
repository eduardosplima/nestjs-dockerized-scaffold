import { remove } from 'fs-extra';
import { createSpinner } from 'nestjs-console';
import { basename } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { RemoveCommand } from '../impl/remove.command';

@CommandHandler(RemoveCommand)
export class RemoveHandler implements ICommandHandler<RemoveCommand, void> {
  async execute(command: RemoveCommand): Promise<void> {
    const { directory } = command;

    const spin = createSpinner();
    spin.start(`Removing ${basename(directory)}`);

    try {
      await remove(directory);
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
  }
}
