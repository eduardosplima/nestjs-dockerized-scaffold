export class CreateNestAppCommand {
  constructor(
    public readonly directory: string,
    public readonly appName: string,
  ) {}
}
