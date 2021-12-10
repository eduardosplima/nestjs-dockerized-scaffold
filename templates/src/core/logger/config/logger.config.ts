import { registerAs } from '@nestjs/config';

export default registerAs('core-logger-config', () => ({
  dirname: process.env.LOGGER_DIRNAME,
  filename: process.env.LOGGER_FILENAME,
  level: process.env.LOGGER_LEVEL as
    | 'error'
    | 'warn'
    | 'info'
    | 'debug'
    | 'trace',
  prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true',
}));
