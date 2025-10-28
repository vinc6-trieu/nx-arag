import { StatsD } from 'hot-shots';

export const dogstatsd = new StatsD({
  host: process.env.DD_AGENT_HOST || '127.0.0.1',
  port: Number(process.env.DD_DOGSTATSD_PORT || 8125),
  mock: process.env.NODE_ENV === 'test',
  globalTags: {
    service: process.env.DD_SERVICE ?? 'app',
    env: process.env.DD_ENV ?? 'development',
    version: process.env.DD_VERSION ?? '0.1.0',
  },
});

// helpers
export const incr = (name: string, value = 1, tags?: string[]) =>
  dogstatsd.increment(name, value, tags);
export const timing = (name: string, ms: number, tags?: string[]) =>
  dogstatsd.timing(name, ms, tags);
