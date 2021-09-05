import { readJson } from 'fs-extra';
import { merge } from 'lodash';
import { createSpinner } from 'nestjs-console';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { MergeJsonsCommand } from '../impl/merge-jsons.command';

@CommandHandler(MergeJsonsCommand)
export class MergeJsonsHandler
  implements ICommandHandler<MergeJsonsCommand, Record<string, unknown>>
{
  async execute(command: MergeJsonsCommand): Promise<Record<string, unknown>> {
    const { srcs, dst, spinText } = command;

    const spin = createSpinner();
    spin.start(spinText);

    let jsonResult: Record<string, unknown>;
    const jsons: Array<Record<string, unknown>> = [];
    try {
      if (typeof dst === 'string') {
        jsons.push(await readJson(dst));
      } else {
        jsons.push(dst);
      }

      await srcs.reduce(async (promise, src) => {
        await promise;
        if (typeof src === 'string') {
          jsons.push(await readJson(src));
        } else {
          jsons.push(src);
        }
      }, Promise.resolve());

      jsonResult = merge({}, ...jsons);
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
    return jsonResult;
  }
}
