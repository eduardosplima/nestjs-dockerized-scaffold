export class MergeObjectsCommand {
  constructor(
    public readonly srcs: Array<string | Record<string, unknown>>,
    public readonly dst: string | Record<string, unknown>,
    public readonly spinText: string,
    public readonly shouldConcatArrays: boolean = true,
  ) {}
}
