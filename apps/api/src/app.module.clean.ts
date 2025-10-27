import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from 'nest-casl';
import { LoggerModule } from 'nestjs-pino';
import tracer from 'dd-trace';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestIdMiddleware, IdempotencyInterceptor, AadBearerStrategy } from '@lib/utils';
import { UserHook } from '../casl/hooks';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { UserRoles } from './domain/entities/user.entity';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { InterfaceModule } from './interface/interface.module';
import { envValidationSchema } from './config/env.validation';
import { RateLimitGuard } from './interface/guards/rate-limit.guard';

@Module({
  imports: [
    // Clean Architecture Layers
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
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
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv =
          configService.get<string>('NODE_ENV') ??
          process.env.NODE_ENV ??
          'development';
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
