import { LoggerOptions } from 'pino';

export function createPinoOptions(serviceName?: string): LoggerOptions {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    name: serviceName || process.env.DD_SERVICE || 'app',
    level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
    // Keep message key as 'msg' (Datadog default mapping is flexible).
    messageKey: 'message',
    // Don't attach pid/hostname twice in k8s; Datadog collects those anyway.
    base: isProd
      ? { service: serviceName || process.env.DD_SERVICE }
      : undefined,
    transport: isProd
      ? undefined
      : {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            translateTime: 'SYS:standard',
          },
        },
  };
}
