import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface APIResponse<T> {
  code: string;
  data: T;
  duration: string;
  error: boolean;
  message: string;
  meta: any;
  path: string;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, APIResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<APIResponse<T>> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        code: String(response.statusCode),
        data,
        duration: `${Date.now() - now}ms`,
        error: response.statusCode >= 400,
        message: response.statusMessage ?? 'OK',
        meta: undefined,
        path: request.url,
      })),
    );
  }
}
