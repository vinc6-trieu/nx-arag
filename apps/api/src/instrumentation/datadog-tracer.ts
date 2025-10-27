import {
  closeDatadogTracer,
  datadogTracer,
  initDatadogTracer,
  isDatadogTracerInitialized,
} from '@lib/observability/datadog-tracer';

initDatadogTracer({ service: 'api' });

export { datadogTracer, closeDatadogTracer };
export const datadogTracerInitialized = () => isDatadogTracerInitialized();
