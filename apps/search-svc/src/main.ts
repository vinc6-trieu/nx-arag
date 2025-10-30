import { config } from 'dotenv';
import { join } from 'node:path';

const envPath =
  process.env.NODE_ENV === 'production'
    ? join(__dirname, '.env')
    : join(__dirname, '../.env');

config({ path: envPath });

import './instrumentation/datadog-metrics';
import './instrumentation/datadog-tracer';

import { SEARCH_PACKAGE_NAME, SEARCH_PROTO_PATH } from '@lib/shared';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const bindAddress =
    process.env.SEARCH_GRPC_BIND_ADDR ?? '0.0.0.0:50051';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: SEARCH_PACKAGE_NAME,
        protoPath: [SEARCH_PROTO_PATH],
        url: bindAddress,
      },
    },
  );

  await app.listen();
  const logger = app.get(Logger);

  if (logger && typeof logger.log === 'function') {
    logger.log(`Search gRPC service listening on ${bindAddress}`);
  } else {
    console.log(`Search gRPC service listening on ${bindAddress}`);
  }
}

bootstrap();
