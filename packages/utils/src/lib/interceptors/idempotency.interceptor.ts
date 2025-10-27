import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { from, mergeMap, Observable, of } from 'rxjs';

interface IdempotencyRecord {
  statusCode: number;
  body: unknown;
}

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  private readonly ttlSeconds: number;
  private readonly methods: Set<string>;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    const configuredTtl = this.configService.get<number>(
      'IDEMPOTENCY_TTL_SECONDS',
    );
    this.ttlSeconds =
      typeof configuredTtl === 'number' && !Number.isNaN(configuredTtl)
        ? configuredTtl
        : 600;

    const methods =
      this.configService.get<string>('IDEMPOTENCY_METHODS') ||
      'POST,PUT,PATCH';

    this.methods = new Set(
      methods
        .split(',')
        .map((method) => method.trim().toUpperCase())
        .filter((method) => method.length > 0),
    );
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const reply = httpContext.getResponse<FastifyReply>();

    const method = (request.method || 'GET').toUpperCase();

    if (!this.methods.has(method) || this.ttlSeconds <= 0) {
      return next.handle();
    }

    const idempotencyKey = this.getIdempotencyKey(request);

    if (!idempotencyKey) {
      return next.handle();
    }

    const cacheKey = this.buildCacheKey(idempotencyKey, method, request.url);

    return from(this.cacheManager.get<IdempotencyRecord>(cacheKey)).pipe(
      mergeMap((cachedRecord) => {
        if (cachedRecord) {
          reply.header('Idempotent-Replayed', 'true');
          reply.header('Idempotency-Key', idempotencyKey);
          reply.status(cachedRecord.statusCode);
          return of(cachedRecord.body);
        }

        reply.header('Idempotency-Key', idempotencyKey);

        return next.handle().pipe(
          mergeMap(async (body) => {
            const record: IdempotencyRecord = {
              statusCode: reply.statusCode,
              body,
            };

            await this.cacheManager.set(cacheKey, record, this.ttlSeconds);

            return body;
          }),
        );
      }),
    );
  }

  private getIdempotencyKey(request: FastifyRequest): string | undefined {
    const headerValue = request.headers['idempotency-key'];

    if (Array.isArray(headerValue)) {
      return headerValue.find((value) => value && value.length > 0);
    }

    if (typeof headerValue === 'string' && headerValue.length > 0) {
      return headerValue;
    }

    return undefined;
  }

  private buildCacheKey(
    idempotencyKey: string,
    method: string,
    url: string,
  ): string {
    return `idempotency:${method}:${url}:${idempotencyKey}`;
  }
}
