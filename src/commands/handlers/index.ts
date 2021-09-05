import { CopyHandler } from './copy.handler';
import { CreateNestAppHandler } from './create-nest-app.handler';
import { CreateTmpDirHandler } from './create-tmp-dir.handler';
import { ExecNpmCliHandler } from './exec-npm-cli.handler';
import { MergeJsonsHandler } from './merge-jsons.handler';
import { WriteHandler } from './write.handler';

export const CommandHandlers = [
  CopyHandler,
  CreateNestAppHandler,
  CreateTmpDirHandler,
  ExecNpmCliHandler,
  MergeJsonsHandler,
  WriteHandler,
];
