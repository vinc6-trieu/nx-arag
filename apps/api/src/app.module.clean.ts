import { AadBearerStrategy } from '@lib/utils';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CaslModule } from 'nest-casl';
import { LoggerModule } from 'nestjs-pino';
import { APP_GUARD } from '@nestjs/core';
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

    LoggerModule.forRoot({
      pinoHttp: {
        level:
          process.env.LOG_LEVEL ??
          (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:standard',
                },
              }
            : undefined,
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
  ],
})
export class AppModule {}
