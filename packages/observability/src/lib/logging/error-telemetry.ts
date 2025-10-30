import type { Logger } from 'pino';
import { incrementMetric, MetricsTags } from '../metrics/statsd.client';

export interface ErrorTelemetryOptions {
  metricName?: string;
  tags?: string[];
  status?: number;
  route?: string;
  context?: Record<string, unknown>;
  message?: string;
  logLevel?: 'error' | 'warn';
}

export type StructuredLogger =
  | Logger
  | {
      error?(obj: unknown, msg?: string): void;
      warn?(obj: unknown, msg?: string): void;
    };

function buildErrorTags(options: ErrorTelemetryOptions): MetricsTags {
  const baseTags: string[] = [
    `service:${process.env.DD_SERVICE ?? 'api'}`,
    `env:${process.env.DD_ENV ?? process.env.NODE_ENV ?? 'development'}`,
  ];

  if (options.status) baseTags.push(`status:${options.status}`);
  if (options.route) baseTags.push(`route:${options.route}`);
  if (options.tags?.length) baseTags.push(...options.tags);

  return baseTags;
}

export function logErrorWithTelemetry(
  logger: StructuredLogger | undefined,
  err: unknown,
  options: ErrorTelemetryOptions = {},
): void {
  const metric = options.metricName ?? 'app.error';

  incrementMetric(metric, 1, buildErrorTags(options));

  if (!logger) {
    return;
  }

  const payload = {
    err,
    status: options.status,
    route: options.route,
    ...(options.context ?? {}),
  };

  const message =
    options.message ??
    (err instanceof Error ? err.message : 'Unhandled application error');

  const level = options.logLevel ?? 'error';

  if (level === 'warn' && typeof logger.warn === 'function') {
    logger.warn(payload, message);
    return;
  }

  if (typeof (logger as Logger).error === 'function') {
    (logger as Logger).error(payload, message);
  }
}
