export class ReadCommand {
  constructor(
    public readonly file: string,
    public readonly spinText?: string,
  ) {}
}
