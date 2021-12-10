import type { CopyFilterAsync, CopyFilterSync } from 'fs-extra';

export class CopyCommand {
  constructor(
    public readonly src: string,
    public readonly dst: string,
    public readonly filter:
      | CopyFilterSync
      | CopyFilterAsync
      | undefined = undefined,
  ) {}
}
