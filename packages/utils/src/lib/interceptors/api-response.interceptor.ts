import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseEnvelope } from '../common/api-response.types';

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseEnvelope<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponseEnvelope<T>> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        code: String(response.statusCode),
        data,
        duration: `${Date.now() - now}ms`,
        error: response.statusCode >= 400,
        message:
          response.statusMessage ??
          response.raw?.statusMessage ??
          'OK',
        meta: undefined,
        path: request.url,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
