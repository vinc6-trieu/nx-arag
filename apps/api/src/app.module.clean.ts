import { AadBearerStrategy } from '@lib/utils';
import { Module } from '@nestjs/common';
import { CaslModule } from 'nest-casl';
import { UserHook } from '../casl/hooks';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { UserRoles } from './domain/entities/user.entity';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { InterfaceModule } from './interface/interface.module';

@Module({
  imports: [
    // Clean Architecture Layers
    DomainModule,
    InfrastructureModule,
    ApplicationModule,
    InterfaceModule,

    // Authorization
    CaslModule.forRoot<UserRoles>({
      superuserRole: UserRoles.admin,
      getUserFromRequest: (request) => request.user,
      getUserHook: UserHook,
    }),
  ],
  providers: [AadBearerStrategy],
})
export class AppModule {}
