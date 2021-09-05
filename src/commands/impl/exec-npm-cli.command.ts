import { NpmCliCmdEnum } from '../../enums/npm-cli-cmd.enum';

export class ExecNpmCliCommand {
  constructor(
    public readonly directory: string,
    public readonly cmd: NpmCliCmdEnum,
    public readonly packages: Array<string>,
    public readonly spinText: string,
  ) {}
}
