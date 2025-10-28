import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// ⬅️ use your StatsD client (hot-shots), not dd-trace
import { dogstatsd } from 'dd-trace';
import { ApiResponseEnvelope } from '../common/api-response.types';

function coarseRoute(req: any): string {
  return (
    req?.routerPath ||
    req?.routeOptions?.url ||
    (req?.originalUrl || req?.url || '').split('?')[0] ||
    'unknown'
  );
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseEnvelope<T>> {
    const start = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    const method = (req?.method || 'GET').toUpperCase();
    const route = coarseRoute(req);

    const tagsBase = [
      `service:${process.env.DD_SERVICE || 'api'}`,
      `env:${process.env.DD_ENV || 'dev'}`,
      `method:${method}`,
      `route:${route}`,
    ];

    return next.handle().pipe(
      // success path: wrap + metrics
      map((data) => {
        const elapsed = Date.now() - start;
        const status = res?.statusCode || 200;

        console.log('ApiResponseInterceptor - status:', status);
        // Metrics (use histogram for timing; count for requests)
        dogstatsd.histogram('http.server.request', elapsed, [
          ...tagsBase,
          `status:${status}`,
        ]);
        dogstatsd.increment('http.server.request.count', 1, [
          ...tagsBase,
          `status:${status}`,
        ]);

        const payload: ApiResponseEnvelope<T> = {
          code: String(status),
          data,
          duration: `${elapsed}ms`,
          error: status >= 400,
          message: res.statusMessage ?? res.raw?.statusMessage ?? 'OK',
          meta: undefined,
          path: req.url,
          timestamp: new Date().toISOString(),
        };

        return payload;
      }),

      // error path: record metrics and rethrow (your exception filter shapes the error)
      catchError((err) => {
        console.log('ApiResponseInterceptor - caught error:', err);
        const elapsed = Date.now() - start;
        const status = res?.statusCode || err?.status || err?.statusCode || 500;

        dogstatsd.histogram('http.server.request', elapsed, [
          ...tagsBase,
          `status:${status}`,
        ]);
        dogstatsd.increment('http.server.request.count', 1, [
          ...tagsBase,
          `status:${status}`,
        ]);

        return throwError(() => err);
      }),
    );
  }
}
