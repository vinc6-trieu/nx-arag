import tracer from 'dd-trace';
import { initDatadogTracer } from '@lib/observability';

// Respect enable switch via env (no 'enabled' option in types)
const tracingEnabled = process.env.DD_TRACE_ENABLED !== 'false';

if (tracingEnabled) {
  initDatadogTracer({
    service: process.env.DD_SERVICE,
    env: process.env.DD_ENV,
    version: process.env.DD_VERSION,
    logInjection: process.env.DD_LOGS_INJECTION !== 'false',
    grpc: {
      enabled: process.env.DD_TRACE_GRPC_DISABLED !== 'true',
      service: process.env.DD_GRPC_SERVICE ?? process.env.DD_SERVICE,
      metadata: ['x-request-id', 'dd-trace-id', 'dd-span-id'],
    },
  });
}

export default tracer;
