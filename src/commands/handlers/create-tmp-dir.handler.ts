import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

import { CommandHandler } from '@nestjs/cqrs';
import type { ICommandHandler } from '@nestjs/cqrs';

import { CreateTmpDirCommand } from '../impl/create-tmp-dir.command';

@CommandHandler(CreateTmpDirCommand)
export class CreateTmpDirHandler
  implements ICommandHandler<CreateTmpDirCommand, string>
{
  async execute(command: CreateTmpDirCommand): Promise<string> {
    const { prefix } = command;
    return mkdtemp(join(tmpdir(), `${prefix}-`));
  }
}
