import tracer, { InitConfiguration } from 'dd-trace';

const isTestEnv = process.env.NODE_ENV === 'test';

const coerceBoolean = (value: string | undefined): boolean | undefined => {
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

const tracerConfig: InitConfiguration = {
  logInjection: true,
};

if (process.env.DD_SERVICE) {
  tracerConfig.service = process.env.DD_SERVICE;
}

if (process.env.DD_ENV) {
  tracerConfig.env = process.env.DD_ENV;
}

if (process.env.DD_VERSION) {
  tracerConfig.version = process.env.DD_VERSION;
}

const enabledFlag = coerceBoolean(process.env.DD_TRACE_ENABLED);
if (enabledFlag !== undefined) {
  tracerConfig.enabled = enabledFlag;
}

export const datadogTracerInitialized = !isTestEnv && enabledFlag !== false;

if (!isTestEnv) {
  tracer.init(tracerConfig);
}

export default tracer;
