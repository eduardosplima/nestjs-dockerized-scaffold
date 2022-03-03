import { readFile, readJson } from 'fs-extra';
import { load as loadYaml } from 'js-yaml';
import { createSpinner } from 'nestjs-console';
import { basename, extname } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { ReadCommand } from '../impl/read.command';

@CommandHandler(ReadCommand)
export class ReadHandler
  implements ICommandHandler<ReadCommand, string | Record<string, unknown>>
{
  async execute(
    command: ReadCommand,
  ): Promise<string | Record<string, unknown>> {
    const { file, spinText } = command;

    const filename = basename(file);
    const fileext = extname(filename);

    const spin = spinText ? createSpinner() : undefined;
    if (spin) spin.start(`Reading ${filename}`);

    let result: string | Record<string, unknown>;
    try {
      if (fileext === '.yml' || fileext === '.yaml') {
        result = loadYaml(await readFile(file, 'utf8')) as Record<
          string,
          unknown
        >;
      } else if (fileext === '.json') {
        result = await readJson(file);
      } else {
        result = await readFile(file, 'utf8');
      }
    } catch (err) {
      if (spin) spin.fail();
      throw err;
    }

    if (spin) spin.succeed();
    return result;
  }
}
