import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { MetadataEnum } from '../enums/metadata.enum';
import { HttpLoggerInterceptor } from '../interceptors/http-logger.interceptor';
import type { HttpLoggerOptions } from '../interfaces/http-logger-options.interface';

export function HttpLogger(
  options: HttpLoggerOptions = { level: 'debug' },
): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(MetadataEnum.HTTP_LOGGER_OPTIONS_METADATA, options),
    UseInterceptors(HttpLoggerInterceptor),
  );
}
