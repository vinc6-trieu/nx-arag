import {
  AadBearerStrategy,
  IdempotencyInterceptor,
  RequestIdMiddleware,
} from '@lib/utils';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import tracer from 'dd-trace';
import { CaslModule } from 'nest-casl';
import { LoggerModule } from 'nestjs-pino';
import { UserHook } from '../casl/hooks';
import { ApplicationModule } from './application/application.module';
import { datadogConfig, DatadogConfig } from './config/datadog.config';
import { envValidationSchema } from './config/env.validation';
import { DomainModule } from './domain/domain.module';
import { UserRoles } from './domain/entities/user.entity';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DatadogTracerShutdown } from './instrumentation/datadog-tracer.shutdown';
import { RateLimitGuard } from './interface/guards/rate-limit.guard';
import { InterfaceModule } from './interface/interface.module';

@Module({
  imports: [
    // Clean Architecture Layers
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [datadogConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get<number>('CACHE_TTL_SECONDS', 300),
        max: configService.get<number>('CACHE_MAX_ITEMS', 1000),
      }),
    }),
    DomainModule,
    InfrastructureModule,
    ApplicationModule,
    InterfaceModule,

    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV', 'development');
        const datadog = configService.get<DatadogConfig>('datadog');

        const logLevel =
          configService.get<string>('LOG_LEVEL') ??
          (nodeEnv === 'production' ? 'info' : 'debug');

        const service =
          configService.get<string>('DD_SERVICE') ?? process.env.DD_SERVICE;
        const env = configService.get<string>('DD_ENV') ?? process.env.DD_ENV;
        const version =
          configService.get<string>('DD_VERSION') ?? process.env.DD_VERSION;

        return {
          pinoHttp: {
            level: logLevel,
            base: {
              env: datadog?.env ?? configService.get<string>('DD_ENV'),
              service:
                datadog?.service ?? configService.get<string>('DD_SERVICE'),
              version:
                datadog?.version ?? configService.get<string>('DD_VERSION'),
              ...(service ? { service } : {}),
              ...(env ? { env } : {}),
              ...(version ? { version } : {}),
            },
            customProps: () => {
              const scope = tracer.scope();
              const span = scope.active();

              if (!span) {
                return {};
              }

              const context = span.context();

              return {
                'dd.trace_id': context.toTraceId(),
                'dd.span_id': context.toSpanId(),
              };
            },
            transport:
              nodeEnv !== 'production'
                ? {
                    target: 'pino-pretty',
                    options: {
                      singleLine: true,
                      translateTime: 'SYS:standard',
                    },
                  }
                : undefined,
          },
        };
      },
    }),

    // Authorization
    CaslModule.forRoot<UserRoles>({
      superuserRole: UserRoles.admin,
      getUserFromRequest: (request) => request.user,
      getUserHook: UserHook,
    }),
  ],
  providers: [
    AadBearerStrategy,
    DatadogTracerShutdown,
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
