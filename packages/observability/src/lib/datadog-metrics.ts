import { StatsD } from 'hot-shots';
import type { StatsD as StatsDClient, StatsDOptions } from 'hot-shots';

type Nullable<T> = T | undefined;

export interface DatadogMetricsInitOptions extends StatsDOptions {
  /** Override the Datadog service name. Defaults to the value of `DD_SERVICE` if set. */
  service?: string;
  /** Override the Datadog environment. Defaults to the value of `DD_ENV` if set. */
  env?: string;
  /** Override the Datadog service version. Defaults to the value of `DD_VERSION` if set. */
  version?: string;
}

let client: StatsDClient | undefined;

const parsePort = (value: Nullable<number | string>): Nullable<number> => {
  if (value === undefined) {
    return undefined;
  }

  const numeric = typeof value === 'number' ? value : Number.parseInt(value, 10);

  return Number.isFinite(numeric) ? numeric : undefined;
};

const buildGlobalTags = (
  options: DatadogMetricsInitOptions,
): Nullable<string[]> => {
  const {
    globalTags = [],
    service = process.env.DD_SERVICE,
    env = process.env.DD_ENV,
    version = process.env.DD_VERSION,
  } = options;

  const tags = Array.isArray(globalTags) ? [...globalTags] : [];

  if (service) {
    tags.push(`service:${service}`);
  }

  if (env) {
    tags.push(`env:${env}`);
  }

  if (version) {
    tags.push(`version:${version}`);
  }

  return tags.length > 0 ? tags : undefined;
};

export const initDatadogMetrics = (
  options: DatadogMetricsInitOptions = {},
): StatsDClient | undefined => {
  if (client) {
    return client;
  }

  if (process.env.NODE_ENV === 'test') {
    return undefined;
  }

  const { service: _s, env: _e, version: _v, ...rest } = options;

  const host = rest.host ?? process.env.DD_AGENT_HOST;
  const port = parsePort(rest.port ?? process.env.DD_DOGSTATSD_PORT);
  const globalTags = buildGlobalTags(options);

  client = new StatsD({
    ...rest,
    host,
    port,
    globalTags,
  });

  return client;
};

export const metricsClient = (): StatsDClient | undefined => client;

export const shutdownDatadogMetrics = async (timeoutMs = 2000): Promise<void> => {
  if (!client) {
    return;
  }

  const current = client;

  await new Promise<void>((resolve) => {
    try {
      const timer = setTimeout(() => resolve(), timeoutMs);

      current.close(() => {
        clearTimeout(timer);
        resolve();
      });
    } catch {
      resolve();
    }
  });

  client = undefined;
};
