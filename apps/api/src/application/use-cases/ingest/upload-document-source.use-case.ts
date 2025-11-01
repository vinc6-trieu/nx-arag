import { SubmitDocumentResponseDto } from '@lib/shared';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Buffer } from 'node:buffer';
import {
  OBJECT_STORAGE_SERVICE,
  type ObjectStorageServicePort,
  type UploadDocumentSourceResult,
} from '../../../domain/services/object-storage.service.interface';
import {
  INGEST_SERVICE,
  type IngestServicePort,
} from '../../../domain/services/ingest.service.interface';

export interface UploadDocumentSourceCommand {
  buffer: Buffer;
  originalName: string;
  mimeType?: string;
  documentId?: string;
  tenantId?: string;
  requestedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadDocumentSourceResponse
  extends UploadDocumentSourceResult {
  ingestJob: SubmitDocumentResponseDto;
}

@Injectable()
export class UploadDocumentSourceUseCase {
  constructor(
    @Inject(OBJECT_STORAGE_SERVICE)
    private readonly storageService: ObjectStorageServicePort,
    @Inject(INGEST_SERVICE)
    private readonly ingestService: IngestServicePort,
  ) {}

  async execute(
    command: UploadDocumentSourceCommand,
  ): Promise<UploadDocumentSourceResponse> {
    const { buffer, originalName } = command;

    if (!buffer?.length) {
      throw new BadRequestException('Uploaded file is empty');
    }

    if (!originalName?.trim()) {
      throw new BadRequestException('Uploaded file is missing a filename');
    }

    const normalizedMetadata = this.normalizeMetadata(command.metadata);
    const storageResult = await this.storageService.uploadDocumentSource({
      documentId: command.documentId?.trim() || undefined,
      tenantId: command.tenantId?.trim() || undefined,
      requestedBy: command.requestedBy?.trim() || undefined,
      originalName,
      contentType: command.mimeType?.trim() || undefined,
      data: buffer,
      metadata: normalizedMetadata,
    });

    const ingestJob = await this.ingestService.submitDocument({
      title: this.deriveTitle(originalName),
      tenantId: command.tenantId?.trim() || undefined,
      requestedBy: command.requestedBy?.trim() || undefined,
      documentId: storageResult.documentId,
      source: {
        kind: 'uri',
        uri: storageResult.uri,
      },
      contentType: storageResult.contentType,
      metadata: this.toIngestMetadata(normalizedMetadata),
    });

    return {
      ...storageResult,
      ingestJob,
    };
  }

  private normalizeMetadata(
    metadata?: Record<string, unknown>,
  ): Record<string, string | undefined> | undefined {
    if (!metadata) {
      return undefined;
    }

    return Object.entries(metadata).reduce<Record<string, string | undefined>>(
      (acc, [key, value]) => {
        if (value === undefined || value === null) {
          acc[key] = undefined;
          return acc;
        }

        acc[key] = typeof value === 'string' ? value : JSON.stringify(value);
        return acc;
      },
      {},
    );
  }

  private toIngestMetadata(
    metadata?: Record<string, string | undefined>,
  ): Record<string, string> | undefined {
    if (!metadata) {
      return undefined;
    }

    const entries = Object.entries(metadata).reduce<
      Record<string, string>
    >((acc, [key, value]) => {
      if (value === undefined) {
        return acc;
      }

      acc[key] = value;
      return acc;
    }, {});

    return Object.keys(entries).length ? entries : undefined;
  }

  private deriveTitle(originalName: string): string {
    const trimmed = originalName.trim();
    if (!trimmed) {
      return 'Untitled Document';
    }

    const dotIndex = trimmed.lastIndexOf('.');
    if (dotIndex > 0) {
      const candidate = trimmed.slice(0, dotIndex).trim();
      if (candidate.length >= 3) {
        return candidate;
      }
    }

    return trimmed;
  }
}
