/* Avoid ESM/named-export interop issues with Nx/webpack by using CJS require */

const ddtrace = require('dd-trace') as any;

export type Tracer = import('dd-trace').Tracer;

export interface DatadogTracerInitOptions {
  service?: string;
  env?: string;
  version?: string;
  logInjection?: boolean;
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

  return ddtrace as Tracer;
}

/* Side-effect init path (optional): uncomment if you prefer auto-init on import) */
// initDatadogTracer();

export default ddtrace as Tracer;
