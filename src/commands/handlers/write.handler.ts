import { outputFile, outputJson } from 'fs-extra';
import { dump as dumpYaml } from 'js-yaml';
import { createSpinner } from 'nestjs-console';
import { basename, extname } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { WriteCommand } from '../impl/write.command';

@CommandHandler(WriteCommand)
export class WriteHandler implements ICommandHandler<WriteCommand, void> {
  async execute(command: WriteCommand): Promise<void> {
    const { file, data } = command;

    const filename = basename(file);
    const fileext = extname(filename);

    const spin = createSpinner();
    spin.start(`Writing ${filename}`);

    try {
      if (fileext === '.yml' || fileext === '.yaml') {
        await outputFile(file, dumpYaml(data));
      } else if (fileext === '.json') {
        await outputJson(file, data, { spaces: 2 });
      } else {
        await outputFile(file, data);
      }
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
  }
}
