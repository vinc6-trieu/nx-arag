import tracer from 'dd-trace';

// Respect enable switch via env (no 'enabled' option in types)
const tracingEnabled = process.env.DD_TRACE_ENABLED !== 'false';

if (tracingEnabled) {
  tracer.init({
    service: process.env.DD_SERVICE,
    env: process.env.DD_ENV,
    version: process.env.DD_VERSION,
    logInjection: process.env.DD_LOGS_INJECTION !== 'false',
  });
}

export default tracer;
