import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Buffer } from 'node:buffer';
import {
  OBJECT_STORAGE_SERVICE,
  type ObjectStorageServicePort,
  type UploadDocumentSourceResult,
} from '../../../domain/services/object-storage.service.interface';

export interface UploadDocumentSourceCommand {
  buffer: Buffer;
  originalName: string;
  mimeType?: string;
  documentId?: string;
  tenantId?: string;
  requestedBy?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class UploadDocumentSourceUseCase {
  constructor(
    @Inject(OBJECT_STORAGE_SERVICE)
    private readonly storageService: ObjectStorageServicePort,
  ) {}

  async execute(
    command: UploadDocumentSourceCommand,
  ): Promise<UploadDocumentSourceResult> {
    const { buffer, originalName } = command;

    if (!buffer?.length) {
      throw new BadRequestException('Uploaded file is empty');
    }

    if (!originalName?.trim()) {
      throw new BadRequestException(
        'Uploaded file is missing a filename',
      );
    }

    return this.storageService.uploadDocumentSource({
      documentId: command.documentId?.trim() || undefined,
      tenantId: command.tenantId?.trim() || undefined,
      requestedBy: command.requestedBy?.trim() || undefined,
      originalName,
      contentType: command.mimeType?.trim() || undefined,
      data: buffer,
      metadata: this.normalizeMetadata(command.metadata),
    });
  }

  private normalizeMetadata(
    metadata?: Record<string, unknown>,
  ): Record<string, string | undefined> | undefined {
    if (!metadata) {
      return undefined;
    }

    return Object.entries(metadata).reduce<
      Record<string, string | undefined>
    >((acc, [key, value]) => {
      if (value === undefined || value === null) {
        acc[key] = undefined;
        return acc;
      }

      acc[key] =
        typeof value === 'string' ? value : JSON.stringify(value);
      return acc;
    }, {});
  }
}
