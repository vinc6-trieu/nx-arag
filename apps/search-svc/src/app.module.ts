import { datadogConfig, searchEnvValidationSchema } from '@lib/config';
import { NestLoggerModule } from '@lib/observability';
import { GrpcRequestIdInterceptor, GrpcTelemetryInterceptor } from '@lib/utils';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './services/search.service';

@Module({
  imports: [
    NestLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [datadogConfig],
      validationSchema: searchEnvValidationSchema,
    }),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    { provide: APP_INTERCEPTOR, useClass: GrpcRequestIdInterceptor },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (logger: PinoLogger) =>
        new GrpcTelemetryInterceptor({
          logger,
          requestCountMetric: 'search.grpc.requests',
          timingMetric: 'search.grpc.duration',
        }),
      inject: [PinoLogger],
    },
  ],
})
export class AppModule {}
