import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from '../domain/repositories/user.repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { ExternalAuthService } from './services/external-auth.service';
import {
  SearchGrpcClientModule,
  SearchGrpcService,
  SearchServiceProvider,
} from './services/search-grpc.service';

@Module({
  imports: [SearchGrpcClientModule],
  providers: [
    // Repository Implementations
    UserRepositoryImpl,
    {
      provide: USER_REPOSITORY,
      useExisting: UserRepositoryImpl,
    },

    // External Services
    ExternalAuthService,
    SearchGrpcService,
    SearchServiceProvider,

    // Infrastructure Services
    PrismaService,
  ],
  exports: [
    USER_REPOSITORY,
    ExternalAuthService,
    PrismaService,
    SearchGrpcService,
    SearchServiceProvider,
  ],
})
export class InfrastructureModule {}
