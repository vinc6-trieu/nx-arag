import { datadogConfig, envValidationSchema } from '@lib/config';
import { NestLoggerModule } from '@lib/observability';
import {
  AadBearerStrategy,
  GlobalExceptionFilter,
  IdempotencyInterceptor,
} from '@lib/utils';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CaslModule } from 'nest-casl';
import { ApplicationModule } from './application/application.module';
import { UserHook } from './casl/hooks';
import { DomainModule } from './domain/domain.module';
import { UserRoles } from './domain/entities/user.entity';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DatadogTracerShutdown } from './instrumentation/datadog-tracer.shutdown';
import { RateLimitGuard } from './interface/guards/rate-limit.guard';
import { InterfaceModule } from './interface/interface.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      load: [datadogConfig],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('CACHE_TTL_SECONDS', 300),
        max: config.get<number>('CACHE_MAX_ITEMS', 1000),
      }),
    }),
    NestLoggerModule,

    // Clean layers
    DomainModule,
    InfrastructureModule,
    ApplicationModule,
    InterfaceModule,

    // Authorization
    CaslModule.forRoot<UserRoles>({
      superuserRole: UserRoles.admin,
      getUserFromRequest: (req) => req.user,
      getUserHook: UserHook,
    }),
  ],
  providers: [
    AadBearerStrategy,
    DatadogTracerShutdown,
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_INTERCEPTOR, useClass: IdempotencyInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {}
