import { once } from 'events';
import { createReadStream } from 'fs';
import { outputFile } from 'fs-extra';
import { createSpinner } from 'nestjs-console';
import { join } from 'path';
import { createInterface } from 'readline';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { SrcUncommentCommand } from '../impl/src-uncomment.command';

@CommandHandler(SrcUncommentCommand)
export class SrcUncommentHandler
  implements ICommandHandler<SrcUncommentCommand, void>
{
  async execute(command: SrcUncommentCommand): Promise<void> {
    const { srcDirectory, srcUncommentConfigList } = command;

    const spin = createSpinner();
    spin.start(`Customizing src`);

    try {
      await Promise.all(
        Object.values(srcUncommentConfigList).map((srcUncommentConfig) => {
          return (async () => {
            const lines: string[] = [];
            const file = join(srcDirectory, ...srcUncommentConfig.path);

            const reader = createInterface({
              input: createReadStream(file),
              crlfDelay: Infinity,
            });
            reader.on('line', (line) => lines.push(line));
            await once(reader, 'close');

            lines.forEach((line, index) => {
              if (
                srcUncommentConfig.lines.some((_line) => line.includes(_line))
              ) {
                lines[index] = line.replace('// ', '');
              }
            });

            outputFile(file, lines.join('\n'));
          })();
        }),
      );
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
  }
}
