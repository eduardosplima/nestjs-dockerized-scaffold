export interface EnvConfig {
  comment?: string;

  hideIfNull: boolean;

  lineCommented: boolean;

  lineSeparator: boolean;

  value: unknown;

  valueIfContainer?: unknown;
}
