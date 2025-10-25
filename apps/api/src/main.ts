import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.clean';

import { config } from 'dotenv';
import { ApiResponseInterceptor } from 'packages/utils/src';
import { join } from 'path';

// Automatically load correct .env file
const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env') // for dist
    : join(__dirname, '../.env'); // for development

config({ path: envPath });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow cross-origin requests from the frontend
  app.enableCors();

  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
