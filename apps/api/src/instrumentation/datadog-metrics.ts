import { initDatadogMetrics } from '@nx-arag/observability';

const env = process.env.DD_ENV ?? process.env.NODE_ENV ?? undefined;

export const datadogMetrics = initDatadogMetrics({
  service: 'api',
  env,
  version: process.env.DD_VERSION,
});

export default datadogMetrics;
