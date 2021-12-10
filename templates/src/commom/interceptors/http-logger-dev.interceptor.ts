import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Injectable } from '@nestjs/common';
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { LoggerService } from '../../core/logger/logger.service';
import { MetadataEnum } from '../enums/metadata.enum';
import type { HttpLoggerOptions } from '../interfaces/http-logger-options.interface';

@Injectable()
export class HttpLoggerInterceptorDEV implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const httpLoggerOptions = this.reflector.get<HttpLoggerOptions>(
      MetadataEnum.HTTP_LOGGER_OPTIONS_METADATA,
      context.getHandler(),
    );

    if (httpLoggerOptions) return next.handle();

    const httpContext = context.switchToHttp();

    const request = httpContext.getRequest<FastifyRequest>();
    const {
      ip,
      url,
      method,
      params,
      query,
      // @ts-expect-error 'O lint não reconhece o "req.user"'
      user,
    } = request;
    const { body, headers } = request;
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
