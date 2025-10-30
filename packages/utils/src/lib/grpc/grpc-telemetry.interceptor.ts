import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Metadata } from '@grpc/grpc-js';
import {
  histogramMetric,
  incrementMetric,
  logErrorWithTelemetry,
  StructuredLogger,
} from '@lib/observability';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface GrpcTelemetryInterceptorOptions {
  /** Optional logger; defaults to undefined to avoid forcing consumers to bind one. */
  logger?: StructuredLogger;
  /** Metric name override for request counts. */
  requestCountMetric?: string;
  /** Metric name override for timing histogram. */
  timingMetric?: string;
}

const DEFAULT_REQUEST_METRIC = 'grpc.server.request.count';
const DEFAULT_TIMING_METRIC = 'grpc.server.duration';
const REQUEST_ID_METADATA_KEY = 'x-request-id';

function readMetadata(context: ExecutionContext): Metadata | undefined {
  const args = context.getArgs();

  for (const arg of args) {
    if (
      arg &&
      typeof arg === 'object' &&
      typeof (arg as Metadata).getMap === 'function'
    ) {
      return arg as Metadata;
    }
  }

  return undefined;
}

function coerceMetadataValue(
  metadata: Metadata | undefined,
  key: string,
): string | undefined {
  if (!metadata) return undefined;

  const values = metadata.get(key);
  if (!values?.length) return undefined;

  const candidate = values[0];
  if (typeof candidate === 'string') return candidate;
  if (Buffer.isBuffer(candidate)) return candidate.toString('utf8');
  return undefined;
}

function buildTags(serviceName: string, methodName: string): string[] {
  return [
    'rpc.system:grpc',
    `rpc.service:${serviceName}`,
    `rpc.method:${methodName}`,
  ];
}

@Injectable()
export class GrpcTelemetryInterceptor implements NestInterceptor {
  constructor(
    private readonly options: GrpcTelemetryInterceptorOptions = {},
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const start = Date.now();
    const handlerName = context.getHandler()?.name ?? 'unknown';
    const className = context.getClass()?.name ?? 'GrpcHandler';
    const route = `${className}/${handlerName}`;
    const metadata = readMetadata(context);
    const requestId = coerceMetadataValue(metadata, REQUEST_ID_METADATA_KEY);

    const baseTags = buildTags(className, handlerName);
    const requestMetric = this.options.requestCountMetric ?? DEFAULT_REQUEST_METRIC;
    const timingMetric = this.options.timingMetric ?? DEFAULT_TIMING_METRIC;
    const logger = this.options.logger;

    return next.handle().pipe(
      tap(() => {
        const elapsed = Date.now() - start;
        histogramMetric(timingMetric, elapsed, [...baseTags, 'status:0']);
        incrementMetric(requestMetric, 1, [...baseTags, 'status:0']);
      }),
      catchError((err) => {
        const elapsed = Date.now() - start;
        const statusTag =
          typeof (err as any)?.code === 'number'
            ? `status:${(err as any).code}`
            : 'status:error';

        histogramMetric(timingMetric, elapsed, [...baseTags, statusTag]);
        incrementMetric(requestMetric, 1, [...baseTags, statusTag]);

        logErrorWithTelemetry(logger, err, {
          metricName: 'grpc.server.error',
          route,
          status: typeof (err as any)?.code === 'number' ? (err as any).code : undefined,
          tags: [...baseTags, statusTag],
          context: {
            elapsed,
            requestId,
          },
          message: `Unhandled gRPC error in ${route}`,
        });

        return throwError(() => err);
      }),
    );
  }
}
