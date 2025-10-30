import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Optional } from '@nestjs/common';
import type { Metadata } from '@grpc/grpc-js';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';

export interface GrpcRequestIdInterceptorOptions {
  /** Metadata key to store the request identifier. Defaults to 'x-request-id'. */
  metadataKey?: string;
  /** Accept an incoming metadata value if present. Defaults to true. */
  trustIncoming?: boolean;
  /** Optional custom generator when there is no incoming request id. */
  generator?: () => string;
  /**
   * If provided, called with the resolved request id and the raw gRPC call object.
   * Useful for binding structured loggers.
   */
  onRequestId?(requestId: string, call?: unknown): void;
}

const DEFAULT_METADATA_KEY = 'x-request-id';

function readMetadata(context: ExecutionContext): Metadata | undefined {
  const args = context.getArgs();

  // By convention, Nest passes gRPC Metadata as the second argument.
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

function readCall(context: ExecutionContext): unknown {
  // Server call is usually the third argument in Nest gRPC handlers.
  return context.getArgs()[2];
}

function extractExisting(
  metadata: Metadata,
  key: string,
  trustIncoming: boolean,
): string | undefined {
  if (!trustIncoming) return undefined;

  const values = metadata.get(key);
  if (!values?.length) return undefined;

  const candidate = values[0];
  if (typeof candidate === 'string') return candidate;
  if (Buffer.isBuffer(candidate)) return candidate.toString('utf8');
  return undefined;
}

@Injectable()
export class GrpcRequestIdInterceptor implements NestInterceptor {
  private readonly options: GrpcRequestIdInterceptorOptions;

  constructor(@Optional() options?: GrpcRequestIdInterceptorOptions) {
    this.options = options ?? {};
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'rpc') {
      return next.handle();
    }

    const metadata = readMetadata(context);
    if (!metadata) return next.handle();

    const key = (this.options.metadataKey ?? DEFAULT_METADATA_KEY).toLowerCase();
    const requestId =
      extractExisting(metadata, key, this.options.trustIncoming ?? true) ??
      this.options.generator?.() ??
      randomUUID();

    metadata.set(key, requestId);

    const call = readCall(context);
    if (call && typeof call === 'object') {
      Object.defineProperty(call as object, 'requestId', {
        value: requestId,
        configurable: true,
        enumerable: false,
        writable: true,
      });
    }

    if (typeof this.options.onRequestId === 'function') {
      this.options.onRequestId(requestId, call);
    }

    return next.handle();
  }
}
