import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable, Logger } from '@nestjs/common';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MetadataEnum } from '../enums/metadata.enum';
import type { HttpLoggerOptions } from '../interfaces/http-logger-options.interface';

@Injectable()
export class HttpLoggerInterceptorDEV implements NestInterceptor {
  private readonly logger = new Logger();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpLoggerOptions = this.reflector.get<HttpLoggerOptions>(
      MetadataEnum.HTTP_LOGGER_OPTIONS_METADATA,
      context.getHandler(),
    );

    if (httpLoggerOptions) return next.handle();

    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<
      FastifyRequest & { user: unknown }
    >();
    const { ip, url, method, headers, params, query, body, user } = request;
    this.logger.debug(
      {
        req: { ip, url, method, headers, params, query, body, user },
      },
      'Incoming request',
    );

    const reply = httpContext.getResponse<FastifyReply>();
    const { statusCode } = reply;
    return next.handle().pipe(
      tap((data) => {
        const response = data;
        this.logger.debug(
          {
            res: { statusCode, body: response },
          },
          'Server response',
        );
      }),
    );
  }
}
