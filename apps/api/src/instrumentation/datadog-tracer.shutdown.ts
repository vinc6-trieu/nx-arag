import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import tracer from 'dd-trace';

@Injectable()
export class DatadogTracerShutdown implements OnApplicationShutdown {
  private readonly logger = new Logger(DatadogTracerShutdown.name);

  async onApplicationShutdown() {
    if (process.env.DD_TRACE_ENABLED === 'false') return;

    const ddTracer = tracer as unknown as {
      shutdown?: (
        callback?: (err?: Error | null) => void,
      ) => Promise<void> | void;
      close?: (callback?: (err?: Error | null) => void) => Promise<void> | void;
    };

    const flush = ddTracer.shutdown ?? ddTracer.close;

    if (!flush) {
      // Fall back to a short delay to give the exporter a moment to drain.
      await new Promise((resolve) => setTimeout(resolve, 150));
      return;
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const maybePromise = flush.call(ddTracer, (err?: Error | null) =>
          err ? reject(err) : resolve(),
        );

        if (maybePromise && typeof (maybePromise as Promise<void>).then === 'function') {
          (maybePromise as Promise<void>).then(resolve).catch(reject);
        }
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Failed to flush Datadog tracer on shutdown: ${message}`);
    }
  }
}
