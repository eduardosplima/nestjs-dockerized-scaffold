import { HttpException } from '@nestjs/common';
import type { HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(
    response: string | Record<string, unknown>,
    status: HttpStatus,
    public readonly cause: Error,
  ) {
    super(response, status, { cause });
  }
}
