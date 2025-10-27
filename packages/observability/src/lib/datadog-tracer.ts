import tracer from 'dd-trace';

type Nullable<T> = T | undefined;

export interface InitConfiguration {
  service?: string;
  env?: string;
  version?: string;
  enabled?: boolean;
  logInjection?: boolean;
}

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

const resolveConfigFromEnv = (
  options: DatadogTracerInitOptions,
): {
  config: tracer.TracerOptions;
  enabled: Nullable<boolean>;
} => {
  const envEnabled = coerceBoolean(process.env.DD_TRACE_ENABLED);
  const enabled = options.enabled ?? envEnabled;

  const config: tracer.TracerOptions = {
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
    config.apmTracingEnabled = enabled;
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
  if (!tracerInitialized) return;

  // Helper: best-effort flush with a safety timeout so shutdown isn’t blocked forever
  const flush = async (timeoutMs = 5000) => {
    // dd-trace v5 exposes tracer.flush(cb)
    const p = new Promise<void>((resolve) => {
      try {
        // @ts-expect-error: types may not declare flush in some versions
        tracer.flush?.(resolve);
      } catch {
        resolve();
      }
    });

    // race against timeout
    await Promise.race([
      p,
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  };

  try {
    await flush();

    // dd-trace v5.40.0 provides an async shutdown
    // Fallbacks cover older signatures just in case.
    if (typeof (tracer as any).shutdown === 'function') {
      await (tracer as any).shutdown();
    } else if (typeof (tracer as any).close === 'function') {
      await (tracer as any).close();
    } else if (typeof (tracer as any).stop === 'function') {
      await (tracer as any).stop();
    }
  } catch {
    // swallow: shutdown should never crash your process
  } finally {
    tracerInitialized = false;
  }
};

export { tracer as datadogTracer };
export default tracer;
