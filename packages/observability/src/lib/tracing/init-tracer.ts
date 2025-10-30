const ddtrace = require('dd-trace') as any;

export type Tracer = import('dd-trace').Tracer;

export interface DatadogTracerInitOptions {
  service?: string;
  env?: string;
  version?: string;
  logInjection?: boolean;
  grpc?: {
    enabled?: boolean;
    service?: string;
    /**
     * Provide metadata keys (array) or a filter function for the Datadog gRPC plugin.
     * Useful for forwarding values like request IDs onto span tags.
     */
    metadata?:
      | string[]
      | ((values: Record<string, unknown>) => Record<string, unknown>);
  };
}

/**
 * Call this as early as possible (immediately after dotenv) OR
 * just `import './datadog-tracer'` to run side-effect init.
 */
export function initDatadogTracer(opts: DatadogTracerInitOptions = {}): Tracer {
  const enabled = process.env.DD_TRACE_ENABLED !== 'false';
  if (!enabled) return ddtrace as Tracer;

  const service = opts.service ?? process.env.DD_SERVICE;
  const env = opts.env ?? process.env.DD_ENV;
  const version = opts.version ?? process.env.DD_VERSION;
  const logInjection =
    opts.logInjection ?? process.env.DD_LOGS_INJECTION !== 'false';

  // Optional safe defaults in dev
  if (process.env.DD_LOGS_INJECTION == null)
    process.env.DD_LOGS_INJECTION = 'true';
  if (process.env.DD_RUNTIME_METRICS == null)
    process.env.DD_RUNTIME_METRICS = 'true';

  ddtrace.init({
    service,
    env,
    version,
    logInjection, // supported
    // Other toggles via env ONLY:
    // DD_RUNTIME_METRICS=true
  });

  const grpcConfig = opts.grpc ?? {};
  if (grpcConfig.enabled ?? true) {
    try {
      ddtrace.use('grpc', {
        service: grpcConfig.service ?? service,
        metadata: grpcConfig.metadata,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      console.warn(`[dd-trace] Failed to enable gRPC plugin: ${msg}`);
    }
  }

  return ddtrace as Tracer;
}

/* Side-effect init path (optional): uncomment if you prefer auto-init on import) */
// initDatadogTracer();

export default ddtrace as Tracer;
