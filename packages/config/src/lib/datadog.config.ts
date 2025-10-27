import type { ConfigType } from '@nestjs/config';
import { registerAs } from '@nestjs/config';

const normalizeBoolean = (value: unknown, defaultValue = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'y', 'on'].includes(normalized)) {
      return true;
    }

    if (['false', '0', 'no', 'n', 'off'].includes(normalized)) {
      return false;
    }
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  return defaultValue;
};

export const datadogConfig = registerAs('datadog', () => ({
  env: process.env.DD_ENV ?? 'development',
  service: process.env.DD_SERVICE ?? 'nx-arag-api',
  version: process.env.DD_VERSION ?? 'local',
  traceAgentUrl: process.env.DD_TRACE_AGENT_URL ?? 'http://127.0.0.1:8126',
  agentHost: process.env.DD_AGENT_HOST ?? '127.0.0.1',
  traceEnabled: normalizeBoolean(process.env.DD_TRACE_ENABLED, false),
}));

export type DatadogConfig = ConfigType<typeof datadogConfig>;
