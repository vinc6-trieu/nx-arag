import {
  INGEST_PACKAGE_NAME,
  INGEST_PROTO_PATH,
  INGEST_SERVICE_NAME,
  type IngestDocumentInput,
  type IngestHealthStatus,
  type IngestJobStatusDto,
  type SubmitDocumentResponseDto,
} from '@lib/shared';
import { logErrorWithTelemetry } from '@lib/observability';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport, type ClientGrpc } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { Buffer } from 'node:buffer';
import { lastValueFrom } from 'rxjs';
import {
  INGEST_SERVICE,
  type IngestServicePort,
} from '../../domain/services/ingest.service.interface';

export const INGEST_GRPC_CLIENT_TOKEN = 'INGEST_GRPC_CLIENT';

export const IngestGrpcClientModule = ClientsModule.registerAsync([
  {
    name: INGEST_GRPC_CLIENT_TOKEN,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: INGEST_PACKAGE_NAME,
        protoPath: [INGEST_PROTO_PATH],
        url: config.get<string>('INGEST_SERVICE_GRPC_URL', '127.0.0.1:50052'),
      },
    }),
  },
]);

interface IngestGrpcClient {
  submitDocument(
    data: {
      tenantId?: string;
      requestedBy?: string;
      documentId?: string;
      title?: string;
      sourceUri?: string;
      inlineBytes?: Buffer;
      contentType?: string;
      metadata?: Record<string, string>;
      visibility?: string;
      retentionPolicy?: string;
    },
  ): import('rxjs').Observable<SubmitDocumentResponseDto>;
  getJobStatus(
    data: { jobId: string },
  ): import('rxjs').Observable<IngestJobStatusDto>;
  health(
    data: Record<string, never>,
  ): import('rxjs').Observable<IngestHealthStatus>;
}

@Injectable()
export class IngestGrpcService implements IngestServicePort, OnModuleInit {
  private client!: IngestGrpcClient;

  constructor(
    @Inject(INGEST_GRPC_CLIENT_TOKEN) private readonly grpcClient: ClientGrpc,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IngestGrpcService.name);
  }

  onModuleInit(): void {
    this.client = this.grpcClient.getService<IngestGrpcClient>(INGEST_SERVICE_NAME);
  }

  async submitDocument(
    input: IngestDocumentInput,
  ): Promise<SubmitDocumentResponseDto> {
    try {
      const payload = this.toGrpcPayload(input);
      return await lastValueFrom(this.client.submitDocument(payload));
    } catch (error) {
      logErrorWithTelemetry(this.logger, error, {
        message: 'Failed to submit ingestion document via gRPC',
        tags: ['rpc.system:grpc', 'rpc.service:ingest', 'rpc.method:SubmitDocument'],
        context: {
          hasInlineSource: input.source.kind === 'inline',
          hasMetadata: Boolean(input.metadata && Object.keys(input.metadata).length),
        },
      });
      throw error;
    }
  }

  async getJobStatus(jobId: string): Promise<IngestJobStatusDto> {
    try {
      return await lastValueFrom(this.client.getJobStatus({ jobId }));
    } catch (error) {
      logErrorWithTelemetry(this.logger, error, {
        message: 'Failed to fetch ingestion job status via gRPC',
        tags: ['rpc.system:grpc', 'rpc.service:ingest', 'rpc.method:GetJobStatus'],
        context: { jobId },
      });
      throw error;
    }
  }

  async health(): Promise<IngestHealthStatus> {
    try {
      return await lastValueFrom(this.client.health({}));
    } catch (error) {
      logErrorWithTelemetry(this.logger, error, {
        message: 'Ingestion gRPC health check failed',
        tags: ['rpc.system:grpc', 'rpc.service:ingest', 'rpc.method:Health'],
      });
      throw error;
    }
  }

  private toGrpcPayload(
    input: IngestDocumentInput,
  ): {
    tenantId?: string;
    requestedBy?: string;
    documentId?: string;
    title?: string;
    sourceUri?: string;
    inlineBytes?: Buffer;
    contentType?: string;
    metadata?: Record<string, string>;
    visibility?: string;
    retentionPolicy?: string;
  } {
    const basePayload = {
      tenantId: input.tenantId,
      requestedBy: input.requestedBy,
      documentId: input.documentId,
      title: input.title,
      contentType: input.contentType,
      metadata: input.metadata,
      visibility: input.visibility,
      retentionPolicy: input.retentionPolicy,
    };

    if (input.source.kind === 'inline') {
      return {
        ...basePayload,
        inlineBytes: input.source.data,
      };
    }

    return {
      ...basePayload,
      sourceUri: input.source.uri,
    };
  }
}

export const IngestServiceProvider = {
  provide: INGEST_SERVICE,
  useExisting: IngestGrpcService,
};

