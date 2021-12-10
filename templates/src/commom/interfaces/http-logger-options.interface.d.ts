import type { RedactOptions } from 'fast-redact';

export interface HttpLoggerOptions {
  level: 'error' | 'warn' | 'debug' | 'log' | 'verbose';
  redact?: {
    headers?: RedactOptions;
    body?: RedactOptions;
    response?: RedactOptions;
  };
}
