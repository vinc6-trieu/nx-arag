import {
  type IngestDocumentInput,
  type IngestDocumentSource,
  type IngestHealthStatus,
  type IngestJobStatusDto,
  type SubmitDocumentResponseDto,
} from '@lib/shared';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { Buffer } from 'node:buffer';
import type { SubmitDocumentGrpcRequest } from '../domain/submit-document-request.type';
import type {
  SerializedIngestJob,
  SerializedIngestSource,
} from '../domain/ingest-job.types';
import { IngestQueueService } from './queue/ingest-queue.service';
import { IngestStatusRepository } from './status/ingest-status.repository';

@Injectable()
export class IngestService {
  constructor(
    private readonly queueService: IngestQueueService,
    private readonly statusRepository: IngestStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IngestService.name);
  }

  async submitDocument(
    request: SubmitDocumentGrpcRequest,
  ): Promise<SubmitDocumentResponseDto> {
    const document = this.toIngestDocumentInput(request);
    const documentId = document.documentId ?? randomUUID();
    const jobPayload: SerializedIngestJob = {
      documentId,
      tenantId: document.tenantId,
      requestedBy: document.requestedBy,
      title: document.title,
      contentType: document.contentType,
      metadata: document.metadata,
      visibility: document.visibility,
      retentionPolicy: document.retentionPolicy,
      source: this.serializeSource(document.source),
      queuedAt: new Date().toISOString(),
    };

    const job = await this.queueService.enqueue(jobPayload);

    if (!job.id) {
      this.logger.error(
        { documentId },
        'Queue did not return a job identifier',
      );
      throw new Error('Failed to enqueue ingestion job');
    }

    await this.statusRepository.writeStatus({
      jobId: job.id,
      documentId,
      status: 'pending',
      chunks: [],
    });

    this.logger.info(
      {
        jobId: job.id,
        documentId,
        tenantId: document.tenantId,
        requestedBy: document.requestedBy,
        metadataKeys: Object.keys(document.metadata ?? {}),
      },
      'Enqueued ingestion job',
    );

    return {
      jobId: job.id,
      documentId,
      status: 'pending',
    };
  }

  async getJobStatus(jobId?: string): Promise<IngestJobStatusDto> {
    if (!jobId) {
      return {
        jobId: '',
        status: 'failed',
        errorMessage: 'jobId is required',
        chunks: [],
      };
    }

    const record = await this.statusRepository.readStatus(jobId);
    if (!record) {
      return {
        jobId,
        status: 'unspecified',
        errorMessage: 'job not found',
        chunks: [],
      };
    }

    return {
      jobId,
      documentId: record.documentId,
      status: record.status,
      errorMessage: record.errorMessage,
      chunks: record.chunks ?? [],
    };
  }

  health(): IngestHealthStatus {
    return { status: 'ok' };
  }

  private toIngestDocumentInput(
    request: SubmitDocumentGrpcRequest,
  ): IngestDocumentInput {
    const source = this.resolveSource(request);

    return {
      title: request.title?.trim() || 'Untitled Document',
      tenantId: request.tenantId,
      requestedBy: request.requestedBy,
      documentId: request.documentId,
      source,
      contentType: request.contentType,
      metadata: request.metadata ?? {},
      visibility: request.visibility,
      retentionPolicy: request.retentionPolicy,
    };
  }

  private resolveSource(
    request: SubmitDocumentGrpcRequest,
  ): IngestDocumentSource {
    if (request.inlineBytes && request.inlineBytes.length > 0) {
      return {
        kind: 'inline',
        data: Buffer.isBuffer(request.inlineBytes)
          ? request.inlineBytes
          : Buffer.from(request.inlineBytes),
      };
    }

    if (request.sourceUri?.trim()) {
      return { kind: 'uri', uri: request.sourceUri.trim() };
    }

    throw new BadRequestException(
      'Either sourceUri or inlineBytes must be provided',
    );
  }

  private serializeSource(
    source: IngestDocumentSource,
  ): SerializedIngestSource {
    if (source.kind === 'inline') {
      return {
        kind: 'inline',
        base64Data: source.data.toString('base64'),
      };
    }

    return { kind: 'uri', uri: source.uri };
  }
}
