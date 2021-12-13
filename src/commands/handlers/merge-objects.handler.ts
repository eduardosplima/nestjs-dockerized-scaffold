import { readFile, readJson } from 'fs-extra';
import { load as yamlLoad } from 'js-yaml';
import { isArray, merge, mergeWith, union } from 'lodash';
import { createSpinner } from 'nestjs-console';
import { basename, extname } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { MergeObjectsCommand } from '../impl/merge-objects.command';

@CommandHandler(MergeObjectsCommand)
export class MergeObjectsHandler
  implements ICommandHandler<MergeObjectsCommand, Record<string, unknown>>
{
  async execute(
    command: MergeObjectsCommand,
  ): Promise<Record<string, unknown>> {
    const { srcs, dst, spinText, shouldConcatArrays } = command;

    const spin = createSpinner();
    spin.start(spinText);

    let jsonResult: Record<string, unknown>;
    const jsons: Array<Record<string, unknown>> = [];
    try {
      if (typeof dst === 'string') {
        const filename = basename(dst);
        const fileext = extname(filename);

        if (fileext === '.yml' || fileext === '.yaml') {
          jsons.push(
            yamlLoad(await readFile(dst, 'utf8')) as Record<string, unknown>,
          );
        } else if (fileext === '.json') {
          jsons.push(await readJson(dst));
        } else {
          throw new Error(
            'Merge objects command supports only JSON and YAML files',
          );
        }
      } else {
        jsons.push(dst);
      }

      await srcs.reduce(async (promise, src) => {
        await promise;
        if (typeof src === 'string') {
          const filename = basename(src);
          const fileext = extname(filename);

          if (fileext === '.yml' || fileext === '.yaml') {
            jsons.push(
              yamlLoad(await readFile(src, 'utf8')) as Record<string, unknown>,
            );
          } else if (fileext === '.json') {
            jsons.push(await readJson(src));
          } else {
            throw new Error(
              'Merge objects command supports only JSON and YAML files',
            );
          }
        } else {
          jsons.push(src);
        }
      }, Promise.resolve());

      jsonResult = shouldConcatArrays
        ? mergeWith(
            {},
            ...jsons,
            (
              objValue: unknown,
              srcValue: Array<unknown>,
            ): Array<unknown> | undefined => {
              if (isArray(objValue)) {
                return union(objValue, srcValue);
              }
              return undefined;
            },
          )
        : merge({}, ...jsons);
    } catch (err) {
      spin.fail();
      throw err;
    }

    spin.succeed();
    return jsonResult;
  }
}
