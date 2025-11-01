import { NestLoggerModule } from '@lib/observability';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GetProfileUseCase } from './use-cases/auth/get-profile.use-case';
import { LoginUseCase } from './use-cases/auth/login.use-case';
import { RegisterUseCase } from './use-cases/auth/register.use-case';
import { UpdateProfileUseCase } from './use-cases/auth/update-profile.use-case';
import { GetIngestJobStatusUseCase } from './use-cases/ingest/get-ingest-job-status.use-case';
import { IngestHealthUseCase } from './use-cases/ingest/ingest-health.use-case';
import { SubmitDocumentUseCase } from './use-cases/ingest/submit-document.use-case';
import { UploadDocumentSourceUseCase } from './use-cases/ingest/upload-document-source.use-case';
import { SearchDocumentsUseCase } from './use-cases/search/search-documents.use-case';
import { SearchHealthUseCase } from './use-cases/search/search-health.use-case';

@Module({
  imports: [
    ConfigModule,
    InfrastructureModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
    NestLoggerModule,
  ],
  providers: [
    // Use Cases
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    SearchDocumentsUseCase,
    SearchHealthUseCase,
    SubmitDocumentUseCase,
    GetIngestJobStatusUseCase,
    IngestHealthUseCase,
    UploadDocumentSourceUseCase,
  ],
  exports: [
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    UpdateProfileUseCase,
    SearchDocumentsUseCase,
    SearchHealthUseCase,
    SubmitDocumentUseCase,
    GetIngestJobStatusUseCase,
    IngestHealthUseCase,
    UploadDocumentSourceUseCase,
  ],
})
export class ApplicationModule {}
