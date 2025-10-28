import { Global, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ??
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

        // Datadog identity on every log line
        base: {
          service: process.env.DD_SERVICE || 'api',
          env: process.env.DD_ENV || 'dev',
          version: process.env.DD_VERSION || undefined,
        },

        // Dev-only pretty; JSON in prod so the Agent can parse/correlate
        transport:
          process.env.NODE_ENV !== 'production' &&
          process.env.PRETTY_LOGS !== 'false'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,

        // Auto HTTP request logs
        autoLogging: true,

        // Keep payloads small and safe
        serializers: {
          req(req: any) {
            return {
              id: req.id,
              method: req.method,
              url: req.url,
              remoteAddress: req.ip || req.socket?.remoteAddress,
              userAgent: req.headers?.['user-agent'],
            };
          },
          res(res: any) {
            return {
              statusCode: res.statusCode,
              // content-length is nice to have without dumping bodies
              contentLength: res.getHeader?.('content-length'),
            };
          },
        },

        // Pick a reasonable level based on outcome
        customLogLevel(req, res, err) {
          if (err || res.statusCode >= 500) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        // Correlation + your request id
        customProps(req: any) {
          const props: Record<string, any> = {
            request_id:
              req?.id ||
              (req?.headers?.['x-request-id'] as string) ||
              undefined,
          };

          // Fallback correlation ONLY if DD_LOGS_INJECTION is off
          // dd-trace will auto-inject dd.trace_id/dd.span_id when DD_LOGS_INJECTION=true
          if ((process.env.DD_LOGS_INJECTION || 'true') === 'false') {
            try {
              const tracer = require('dd-trace');
              const span = tracer.scope().active();
              if (span) {
                const ctx = span.context();
                props['dd.trace_id'] = ctx.toTraceId();
                props['dd.span_id'] = ctx.toSpanId();
              }
            } catch {
              // ignore if dd-trace not available
            }
          }

          return props;
        },

        // Strip sensitive fields
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers["x-api-key"]',
            'res.headers["set-cookie"]',
            'password',
          ],
          remove: true,
        },
      },
    }),
  ],
  exports: [LoggerModule],
})
export class NestLoggerModule {}
