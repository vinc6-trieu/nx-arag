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
import {
  IngestGrpcClientModule,
  IngestGrpcService,
  IngestServiceProvider,
} from './services/ingest-grpc.service';
import {
  OBJECT_STORAGE_SERVICE,
} from '../domain/services/object-storage.service.interface';
import { ObjectStorageService } from './services/object-storage.service';

@Module({
  imports: [SearchGrpcClientModule, IngestGrpcClientModule],
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
    IngestGrpcService,
    IngestServiceProvider,
    ObjectStorageService,
    {
      provide: OBJECT_STORAGE_SERVICE,
      useExisting: ObjectStorageService,
    },

    // Infrastructure Services
    PrismaService,
  ],
  exports: [
    USER_REPOSITORY,
    ExternalAuthService,
    PrismaService,
    SearchGrpcService,
    SearchServiceProvider,
    IngestGrpcService,
    IngestServiceProvider,
    ObjectStorageService,
    OBJECT_STORAGE_SERVICE,
  ],
})
export class InfrastructureModule {}
