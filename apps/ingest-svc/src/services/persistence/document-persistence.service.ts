import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Prisma } from '../../prisma/generated';
import { PrismaService } from '../../prisma/prisma.service';

export interface PersistedChunkRecord {
  chunkId: string;
  index: number;
  content: string;
  preview?: string;
  tokenCount?: number;
  embedding?: number[];
}

export interface PersistDocumentPayload {
  documentId: string;
  tenantId?: string;
  requestedBy?: string;
  title: string;
  contentType?: string;
  visibility?: string;
  retentionPolicy?: string;
  metadata?: Record<string, string>;
  sourceUri: string;
  sourceBucket?: string;
  sourceKey?: string;
  chunks: PersistedChunkRecord[];
}

@Injectable()
export class DocumentPersistenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(DocumentPersistenceService.name);
  }

  async persist(payload: PersistDocumentPayload): Promise<void> {
    const { chunks, ...document } = payload;

    try {
      await this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.ingestDocument.upsert({
          where: { documentId: document.documentId },
          create: this.mapDocumentCreate(document),
          update: this.mapDocumentUpdate(document),
        });

        await tx.ingestDocumentChunk.deleteMany({
          where: { documentId: document.documentId },
        });

        if (chunks.length) {
          await tx.ingestDocumentChunk.createMany({
            data: chunks.map((chunk) => ({
              documentId: document.documentId,
              chunkId: chunk.chunkId,
              chunkIndex: chunk.index,
              content: chunk.content,
              preview: chunk.preview,
              tokenCount: chunk.tokenCount,
              embedding: chunk.embedding ?? null,
            })),
          });
        }
      });
    } catch (error) {
      this.logger.error(
        {
          err: error instanceof Error ? error.message : String(error),
          documentId: document.documentId,
        },
        'Failed to persist document and chunks',
      );
      throw error;
    }
  }

  private mapDocumentCreate(document: Omit<PersistDocumentPayload, 'chunks'>) {
    return {
      documentId: document.documentId,
      tenantId: document.tenantId,
      requestedBy: document.requestedBy,
      title: document.title,
      contentType: document.contentType,
      visibility: document.visibility,
      retentionPolicy: document.retentionPolicy,
      metadata: document.metadata,
      sourceUri: document.sourceUri,
      sourceBucket: document.sourceBucket,
      sourceKey: document.sourceKey,
    };
  }

  private mapDocumentUpdate(document: Omit<PersistDocumentPayload, 'chunks'>) {
    return {
      tenantId: document.tenantId,
      requestedBy: document.requestedBy,
      title: document.title,
      contentType: document.contentType,
      visibility: document.visibility,
      retentionPolicy: document.retentionPolicy,
      metadata: document.metadata,
      sourceUri: document.sourceUri,
      sourceBucket: document.sourceBucket,
      sourceKey: document.sourceKey,
    };
  }
}
