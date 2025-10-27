import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { datadogTracer } from '@lib/observability';
import { FastifyReply } from 'fastify';
import { ApiErrorResponse } from '../common/api-response.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, meta } = this.extractMessageAndMeta(exception);

    const body: ApiErrorResponse = {
      code: String(status),
      data: null,
      duration: undefined,
      error: true,
      message,
      meta,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    const span = datadogTracer.scope().active();

    if (span) {
      span.setTag('error', exception as any);

      const errorMessage =
        exception instanceof Error
          ? exception.message
          : typeof exception === 'string'
            ? exception
            : message;

      span.setTag('error.message', errorMessage);

      if (exception instanceof Error && exception.stack) {
        span.setTag('error.stack', exception.stack);
      }
    }

    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    response.status(status).send(body);
  }

  private extractMessageAndMeta(exception: unknown): {
    message: string;
    meta?: Record<string, unknown>;
  } {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === 'string') {
        return { message: response };
      }

      if (typeof response === 'object' && response !== null) {
        const { message, ...rest } = response as Record<string, unknown>;

        if (Array.isArray(message)) {
          return {
            message: message.join(', '),
            meta: {
              errors: message,
              ...rest,
            },
          };
        }

        return {
          message:
            typeof message === 'string'
              ? message
              : exception.message || 'Unexpected error',
          meta: Object.keys(rest).length ? rest : undefined,
        };
      }

      return { message: exception.message || 'Unexpected error' };
    }

    if (exception instanceof Error) {
      return { message: exception.message || 'Internal server error' };
    }

    return { message: 'Internal server error' };
  }
}
