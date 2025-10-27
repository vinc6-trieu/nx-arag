import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from 'nest-casl';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestIdMiddleware, IdempotencyInterceptor, AadBearerStrategy } from '@lib/utils';
import { UserHook } from '../casl/hooks';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { UserRoles } from './domain/entities/user.entity';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { InterfaceModule } from './interface/interface.module';
import { envValidationSchema } from './config/env.validation';
import { datadogConfig, DatadogConfig } from './config/datadog.config';
import { RateLimitGuard } from './interface/guards/rate-limit.guard';

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

        return {
          pinoHttp: {
            level: logLevel,
            base: {
              env: datadog?.env ?? configService.get<string>('DD_ENV'),
              service:
                datadog?.service ?? configService.get<string>('DD_SERVICE'),
              version:
                datadog?.version ?? configService.get<string>('DD_VERSION'),
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
