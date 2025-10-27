import './instrumentation/datadog-tracer';

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor, PinoLogger } from 'nestjs-pino';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import underPressure from '@fastify/under-pressure';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module.clean';

import { config } from 'dotenv';
import { ApiResponseInterceptor, GlobalExceptionFilter } from 'packages/utils/src';
import { join } from 'path';

// Automatically load correct .env file
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env') // for dist
    : join(__dirname, '../.env'); // for development

config({ path: envPath });

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

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.register(underPressure, {
    exposeStatusRoute: {
      url: '/api/health/status',
    },
    healthCheck: async () => ({
      status: 'ok',
    }),
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  const logger = app.get(PinoLogger);
  logger.info(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
