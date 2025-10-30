import type { ClientOptions, Tags } from 'hot-shots';
import { StatsD } from 'hot-shots';

type Nullable<T> = T | undefined;

let sharedClient: Nullable<StatsD>;

const DEFAULT_PORT = 8125;
const DEFAULT_HOST = '127.0.0.1';

export type MetricsInitOptions = ClientOptions;

function buildClient(options?: MetricsInitOptions): StatsD {
  const host = process.env.DD_AGENT_HOST ?? DEFAULT_HOST;
  const port = Number(process.env.DD_DOGSTATSD_PORT ?? DEFAULT_PORT);
  const mock = process.env.NODE_ENV === 'test';

  return new StatsD({
    host,
    port,
    mock,
    globalTags: {
      service: process.env.DD_SERVICE ?? 'app',
      env: process.env.DD_ENV ?? process.env.NODE_ENV ?? 'development',
      version: process.env.DD_VERSION ?? '0.1.0',
      ...(options?.globalTags ?? {}),
    },
    ...options,
  });
}

export function initMetricsClient(options?: MetricsInitOptions): StatsD {
  if (!sharedClient) {
    sharedClient = buildClient(options);
  }

  return sharedClient;
}

export function getMetricsClient(): StatsD {
  if (!sharedClient) {
    sharedClient = buildClient();
  }

  return sharedClient;
}

export function closeMetricsClient(): void {
  if (sharedClient) {
    sharedClient.close();
    sharedClient = undefined;
  }
}

export function withMetricsClient<T>(fn: (client: StatsD) => T): T | undefined {
  try {
    const client = getMetricsClient();
    return fn(client);
  } catch {
    // Intentionally swallow metrics errors so they never break the request flow.
    return undefined;
  }
}

export function metricTags(extra?: Tags): Tags | undefined {
  if (!extra) {
    return undefined;
  }

  if (Array.isArray(extra)) {
    return extra;
  }

  return extra;
}

export function incrementMetric(name: string, value = 1, tags?: Tags): void {
  withMetricsClient((client) => {
    client.increment(name, value, metricTags(tags));
  });
}

export function histogramMetric(
  name: string,
  value: number,
  tags?: Tags,
): void {
  withMetricsClient((client) => {
    client.histogram(name, value, metricTags(tags));
  });
}

export function timingMetric(name: string, ms: number, tags?: Tags): void {
  withMetricsClient((client) => {
    client.timing(name, ms, metricTags(tags));
  });
}

export function gaugeMetric(name: string, value: number, tags?: Tags): void {
  withMetricsClient((client) => {
    client.gauge(name, value, metricTags(tags));
  });
}

export type MetricsTags = Tags;
