import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { dogstatsd } from 'dd-trace';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const req = ctx.getRequest();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // 1) one coarse error metric (optional)
    dogstatsd.increment('app.error', 1, [
      `service:${process.env.DD_SERVICE || 'api'}`,
      `env:${process.env.DD_ENV || 'dev'}`,
      `status:${status}`,
    ]);

    // 2) one structured log line (pino -> stdout -> Datadog)
    //    dd-trace injects dd.trace_id/span_id automatically when DD_LOGS_INJECTION=true
    this.logger.error(
      {
        err: exception, // pino will serialize error safely
        status,
        route: req?.routerPath ?? req?.url ?? 'unknown',
      },
      isHttp ? (exception as HttpException).message : 'Unhandled error',
    );

    // 3) uniform error envelope back to the client
    res.status(status).send({
      success: false,
      error: {
        message: isHttp
          ? (exception as HttpException).message
          : 'Internal server error',
      },
    });
  }
}
