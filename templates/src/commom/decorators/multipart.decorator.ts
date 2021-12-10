import { SetMetadata, UseInterceptors, applyDecorators } from '@nestjs/common';

import { MetadataEnum } from '../enums/metadata.enum';
import { MultipartInterceptor } from '../interceptors/multipart.interceptor';
import type { MultipartOptions } from '../interfaces/multipart-options.interface';

export function Multipart(
  options: MultipartOptions = { strictType: true },
): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    SetMetadata(MetadataEnum.MULTIPART_OPTIONS_METADATA, options),
    UseInterceptors(MultipartInterceptor),
  );
}
