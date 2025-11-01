import { config } from 'dotenv';
import { join } from 'path';

// Load .env FIRST so dd-trace sees DD_* values.
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env')
    : join(__dirname, '../.env');

config({ path: envPath });

// Now tracer + metrics (side-effect init)
import './instrumentation/datadog-metrics';
import './instrumentation/datadog-tracer';

import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import underPressure from '@fastify/under-pressure';
import { requestIdPlugin } from '@lib/utils';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ApiResponseInterceptor } from 'packages/utils/src';
import { AppModule } from './app.module.clean';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );

  app.useLogger(app.get(Logger));

  app.enableShutdownHooks();

  await app.register(helmet, {
    // Disable CSP if necessary for tooling like Swagger; adjust as needed.
    contentSecurityPolicy: false,
  });

  // Allow cross-origin requests from the frontend
  app.enableCors();

  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ApiResponseInterceptor(),
  );

  await app.register(underPressure, {
    exposeStatusRoute: {
      routeOpts: { url: '/api/health/status' },
    },
    healthCheck: async () => ({
      status: 'ok',
    }),
  });

  const configService = app.get(ConfigService);
  const fastify = app.getHttpAdapter().getInstance();

  await fastify.register(multipart, {
    throwFileSizeLimit: true,
    limits: {
      fileSize: configService.get<number>(
        'UPLOAD_MAX_FILE_SIZE_BYTES',
        25 * 1024 * 1024,
      ),
    },
  });

  await fastify.register(requestIdPlugin, {
    // optional tweaks
    headerName: 'X-Request-Id',
    trustIncoming: true,
    // generator: (req) => `svc-${req.id}`, // example
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get<number>('PORT', 3000);
  await app.listen({ port, host: '0.0.0.0' });

  const appLogger = app.get(Logger);
  appLogger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
