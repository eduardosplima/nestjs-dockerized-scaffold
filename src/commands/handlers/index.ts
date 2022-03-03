import { BuildEnvHandler } from './build-env.handler';
import { CopyHandler } from './copy.handler';
import { CreateNestAppHandler } from './create-nest-app.handler';
import { CreateTmpDirHandler } from './create-tmp-dir.handler';
import { ExecNpmCliHandler } from './exec-npm-cli.handler';
import { MergeObjectsHandler } from './merge-objects.handler';
import { ReadHandler } from './read.handler';
import { RemoveHandler } from './remove.handler';
import { SrcUncommentHandler } from './src-uncomment.handler';
import { WriteHandler } from './write.handler';

export const CommandHandlers = [
  BuildEnvHandler,
  CopyHandler,
  CreateNestAppHandler,
  CreateTmpDirHandler,
  ExecNpmCliHandler,
  MergeObjectsHandler,
  ReadHandler,
  RemoveHandler,
  SrcUncommentHandler,
  WriteHandler,
];
