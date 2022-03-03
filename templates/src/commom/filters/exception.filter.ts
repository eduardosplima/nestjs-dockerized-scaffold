import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

import {
  Catch,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type {
  ArgumentsHost,
  ExceptionFilter as IExceptionFilter,
} from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

import { CustomHttpException } from '../exceptions/custom-http.exception';

@Catch()
export class ExceptionFilter implements IExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost): void {
    let statusCode: number;
    let dataToSend: unknown;
    let dataToLog: unknown;
    let logLevel: 'error' | 'warn' | 'debug' | 'log' | 'verbose';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      dataToSend = exception.getResponse();
      logLevel = 'warn';

      if (exception instanceof CustomHttpException) {
        const { cause } = exception;
        dataToLog = { message: cause.message };
      } else {
        if (typeof dataToSend === 'string')
          dataToSend = {
            statusCode,
            message: dataToSend,
          };
        dataToLog = { message: exception.message };
      }
    } else {
      const HttpError =
        HttpErrorByCode[(exception as FastifyError).statusCode] ||
        InternalServerErrorException;
      const httpException: HttpException = new HttpError();

      statusCode = httpException.getStatus();
      dataToSend = httpException.getResponse();
      dataToLog = { message: exception.message, stack: exception.stack };
      logLevel = 'error';
    }

    const httpContext = host.switchToHttp();

    const request = httpContext.getRequest<FastifyRequest>();
    const { ip, url, method, params, query } = request;
    this.logger[logLevel]({
      req: { ip, url, method, params, query },
      res: { statusCode, body: dataToSend },
      exception: dataToLog,
    });

    const reply = httpContext.getResponse<FastifyReply>();
    reply.code(statusCode).send(dataToSend);
  }
}
