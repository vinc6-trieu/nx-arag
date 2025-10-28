import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { ExternalAuthService } from './services/external-auth.service';

@Module({
  providers: [
    // Repository Implementations
    UserRepositoryImpl,

    // External Services
    ExternalAuthService,

    // Infrastructure Services
    PrismaService,
  ],
  exports: [UserRepositoryImpl, ExternalAuthService, PrismaService],
})
export class InfrastructureModule {}
