import { copy } from 'fs-extra';
import { createSpinner } from 'nestjs-console';
import { basename } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { CopyCommand } from '../impl/copy.command';

@CommandHandler(CopyCommand)
export class CopyHandler implements ICommandHandler<CopyCommand, void> {
  async execute(command: CopyCommand): Promise<void> {
    const { src, dst, filter } = command;

    const spin = createSpinner();
    spin.start(`Copying ${basename(src)}`);

    try {
      await copy(src, dst, { filter });
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
  }
}
