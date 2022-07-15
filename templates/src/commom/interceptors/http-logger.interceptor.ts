import fastRedact from 'fast-redact';
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
export class HttpLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpLoggerOptions = this.reflector.get<HttpLoggerOptions>(
      MetadataEnum.HTTP_LOGGER_OPTIONS_METADATA,
      context.getHandler(),
    ) || { level: 'debug' };

    // Performance improvement
    if (!Logger.isLevelEnabled(httpLoggerOptions.level)) return next.handle();

    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<
      FastifyRequest & { user: unknown }
    >();
    const { ip, url, method, params, query, user } = request;
    const body =
      httpLoggerOptions.redact?.body &&
      request.body &&
      typeof request.body === 'object'
        ? fastRedact(httpLoggerOptions.redact.body)(request.body)
        : request.body;
    const headers = httpLoggerOptions.redact?.headers
      ? fastRedact(httpLoggerOptions.redact.headers)(request.headers)
      : request.headers;
    this.logger[httpLoggerOptions.level](
      {
        req: { ip, url, method, headers, params, query, body, user },
      },
      'Incoming request',
    );

    const reply = httpContext.getResponse<FastifyReply>();
    const { statusCode } = reply;
    return next.handle().pipe(
      tap((data) => {
        const response = httpLoggerOptions.redact?.response
          ? fastRedact(httpLoggerOptions.redact.response)(data)
          : data;
        this.logger[httpLoggerOptions.level](
          {
            res: { statusCode, body: response },
          },
          'Server response',
        );
      }),
    );
  }
}
