import { datadogConfig, ingestEnvValidationSchema } from '@lib/config';
import { NestLoggerModule } from '@lib/observability';
import {
  GrpcRequestIdInterceptor,
  GrpcTelemetryInterceptor,
} from '@lib/utils';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';
import { IngestController } from './controllers/ingest.controller';
import { IngestService } from './services/ingest.service';
import { RedisProvider } from './providers/redis.provider';
import { IngestQueueService } from './services/queue/ingest-queue.service';
import { IngestStatusRepository } from './services/status/ingest-status.repository';
import { SourceStorageService } from './services/storage/source-storage.service';
import { ContentExtractionService } from './services/content/content-extraction.service';
import { ChunkingService } from './services/chunking/chunking.service';
import { EmbeddingService } from './services/embedding/embedding.service';
import { IngestWorkerService } from './services/worker/ingest-worker.service';

@Module({
  imports: [
    NestLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datadogConfig],
      validationSchema: ingestEnvValidationSchema,
    }),
  ],
  controllers: [IngestController],
  providers: [
    RedisProvider,
    IngestQueueService,
    IngestStatusRepository,
    SourceStorageService,
    ContentExtractionService,
    ChunkingService,
    EmbeddingService,
    IngestWorkerService,
    IngestService,
    { provide: APP_INTERCEPTOR, useClass: GrpcRequestIdInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logger: PinoLogger) =>
        new GrpcTelemetryInterceptor({
          logger,
          requestCountMetric: 'ingest.grpc.requests',
          timingMetric: 'ingest.grpc.duration',
        }),
      inject: [PinoLogger],
    },
  ],
})
export class AppModule {}
