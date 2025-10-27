import tracer, { InitConfiguration } from 'dd-trace';

type Nullable<T> = T | undefined;

export interface DatadogTracerInitOptions {
  /**
   * Override the Datadog service name. Defaults to the value of `DD_SERVICE` if set.
   */
  service?: string;
  /**
   * Override the Datadog environment. Defaults to the value of `DD_ENV` if set.
   */
  env?: string;
  /**
   * Override the Datadog service version. Defaults to the value of `DD_VERSION` if set.
   */
  version?: string;
  /**
   * Explicitly enable or disable tracing. Overrides `DD_TRACE_ENABLED` when provided.
   */
  enabled?: boolean;
  /**
   * Configure log correlation injection. Defaults to `true`.
   */
  logInjection?: boolean;
}

const coerceBoolean = (value: Nullable<string>): Nullable<boolean> => {
  if (value === undefined) {
    return undefined;
  }

  switch (value.trim().toLowerCase()) {
    case 'true':
    case '1':
    case 'yes':
      return true;
    case 'false':
    case '0':
    case 'no':
      return false;
    default:
      return undefined;
  }
};

let tracerInitialized = false;

const resolveConfigFromEnv = (options: DatadogTracerInitOptions): {
  config: InitConfiguration;
  enabled: Nullable<boolean>;
} => {
  const envEnabled = coerceBoolean(process.env.DD_TRACE_ENABLED);
  const enabled = options.enabled ?? envEnabled;

  const config: InitConfiguration = {
    logInjection: options.logInjection ?? true,
  };

  const service = options.service ?? process.env.DD_SERVICE;
  if (service) {
    config.service = service;
  }

  const env = options.env ?? process.env.DD_ENV;
  if (env) {
    config.env = env;
  }

  const version = options.version ?? process.env.DD_VERSION;
  if (version) {
    config.version = version;
  }

  if (enabled !== undefined) {
    config.enabled = enabled;
  }

  return { config, enabled };
};

export const initDatadogTracer = (
  options: DatadogTracerInitOptions = {},
): boolean => {
  if (tracerInitialized) {
    return true;
  }

  if (process.env.NODE_ENV === 'test') {
    return false;
  }

  const { config, enabled } = resolveConfigFromEnv(options);

  if (enabled === false) {
    return false;
  }

  tracer.init(config);
  tracerInitialized = true;

  return true;
};

export const isDatadogTracerInitialized = (): boolean => tracerInitialized;

export const closeDatadogTracer = async (): Promise<void> => {
  if (!tracerInitialized) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    tracer.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export { tracer as datadogTracer };
export default tracer;
