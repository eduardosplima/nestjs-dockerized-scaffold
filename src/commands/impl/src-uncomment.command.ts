import type { SrcUncommentConfig } from '../../interfaces/src-uncomment-config';

export class SrcUncommentCommand {
  constructor(
    public readonly srcDirectory: string,
    public readonly srcUncommentConfigList: {
      [K in string]: SrcUncommentConfig;
    },
  ) {}
}
