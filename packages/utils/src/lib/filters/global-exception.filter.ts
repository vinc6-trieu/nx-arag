import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { ApiErrorResponse } from '../common/api-response.types';
import {
  AppError,
  AppErrorPayload,
  ErrorKey,
  getErrorCatalogEntry,
} from '../common/errors';
import { logErrorWithTelemetry } from '@lib/observability';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const timestamp = new Date().toISOString();
    const path = req?.url ?? req?.routerPath ?? 'unknown';

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    logErrorWithTelemetry(this.logger, exception, {
      status,
      route: path,
      message: isHttp
        ? (exception as HttpException).message
        : 'Unhandled error',
    });

    // uniform error envelope back to the client
    const baseCatalog = getErrorCatalogEntry(ErrorKey.COMMON_INTERNAL_SERVER_ERROR);

    let responsePayload: ApiErrorResponse = {
      code: String(status),
      data: null,
      error: true,
      message: baseCatalog.message,
      path,
      timestamp,
      'error_code': baseCatalog.code,
      'error_key': ErrorKey.COMMON_INTERNAL_SERVER_ERROR,
    };

    if (exception instanceof AppError) {
      const payload = exception.getResponse() as AppErrorPayload;
      responsePayload = {
        ...responsePayload,
        code: String(status),
        message: payload.message,
        'error_code': payload.errorCode,
        'error_key': payload.errorKey,
        details: payload.details,
      };
    } else if (exception instanceof HttpException) {
      const fallbackCatalog = getErrorCatalogEntry(ErrorKey.COMMON_UNEXPECTED);
      const httpResponse = exception.getResponse();
      const originalMessage =
        typeof httpResponse === 'string'
          ? httpResponse
          : (httpResponse as Record<string, unknown>)?.['message'];

      responsePayload = {
        ...responsePayload,
        code: String(status),
        message: typeof originalMessage === 'string' ? originalMessage : responsePayload.message,
        'error_code': fallbackCatalog.code,
        'error_key': ErrorKey.COMMON_UNEXPECTED,
        details: {
          originalError: httpResponse,
        },
      };
    }

    // Support both Express (res.json) and Fastify (res.send) responses
    if (typeof res.json === 'function') {
      res.status(status).json(responsePayload);
    } else if (typeof res.send === 'function') {
      res.status(status).send(responsePayload);
    } else {
      res.status(status);
      res.end(JSON.stringify(responsePayload));
    }
  }
}
