import {
  closeDatadogTracer,
  datadogTracer,
  initDatadogTracer,
  isDatadogTracerInitialized,
} from '@lib/observability';

initDatadogTracer({ service: 'api' });

export { closeDatadogTracer, datadogTracer };
export const datadogTracerInitialized = () => isDatadogTracerInitialized();
