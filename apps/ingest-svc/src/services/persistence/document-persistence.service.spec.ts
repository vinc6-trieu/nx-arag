import type { PinoLogger } from 'nestjs-pino';
import { DocumentPersistenceService } from './document-persistence.service';

const createLogger = (): PinoLogger =>
  ({
    setContext: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }) as unknown as PinoLogger;

describe('DocumentPersistenceService', () => {
  it('upserts document and replaces chunk records via Prisma', async () => {
    const prismaMock = {
      ingestDocument: {
        upsert: jest.fn(),
      },
      ingestDocumentChunk: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      $transaction: jest.fn(
        async (handler: (tx: any) => Promise<void> | void) => {
          await handler(prismaMock);
        },
      ),
    };

    const service = new DocumentPersistenceService(
      prismaMock as any,
      createLogger(),
    );

    await service.persist({
      documentId: 'doc-1',
      tenantId: 'tenant-42',
      requestedBy: 'user-7',
      title: 'Quarterly Report',
      contentType: 'application/pdf',
      visibility: 'internal',
      retentionPolicy: 'retain',
      metadata: { category: 'finance' },
      sourceUri: 's3://bucket/documents/doc-1/source.pdf',
      sourceBucket: 'bucket',
      sourceKey: 'documents/doc-1/source.pdf',
      chunks: [
        {
          chunkId: 'doc-1-chunk-1',
          index: 1,
          content: 'First chunk content',
          preview: 'First preview',
          tokenCount: 100,
          embedding: [0.1, 0.2],
        },
        {
          chunkId: 'doc-1-chunk-2',
          index: 2,
          content: 'Second chunk content',
          preview: 'Second preview',
          tokenCount: 140,
          embedding: [0.3, 0.4],
        },
      ],
    });

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMock.ingestDocument.upsert).toHaveBeenCalledWith({
      where: { documentId: 'doc-1' },
      create: {
        documentId: 'doc-1',
        tenantId: 'tenant-42',
        requestedBy: 'user-7',
        title: 'Quarterly Report',
        contentType: 'application/pdf',
        visibility: 'internal',
        retentionPolicy: 'retain',
        metadata: { category: 'finance' },
        sourceUri: 's3://bucket/documents/doc-1/source.pdf',
        sourceBucket: 'bucket',
        sourceKey: 'documents/doc-1/source.pdf',
      },
      update: {
        tenantId: 'tenant-42',
        requestedBy: 'user-7',
        title: 'Quarterly Report',
        contentType: 'application/pdf',
        visibility: 'internal',
        retentionPolicy: 'retain',
        metadata: { category: 'finance' },
        sourceUri: 's3://bucket/documents/doc-1/source.pdf',
        sourceBucket: 'bucket',
        sourceKey: 'documents/doc-1/source.pdf',
      },
    });

    expect(prismaMock.ingestDocumentChunk.deleteMany).toHaveBeenCalledWith({
      where: { documentId: 'doc-1' },
    });

    expect(prismaMock.ingestDocumentChunk.createMany).toHaveBeenCalledWith({
      data: [
        {
          documentId: 'doc-1',
          chunkId: 'doc-1-chunk-1',
          chunkIndex: 1,
          content: 'First chunk content',
          preview: 'First preview',
          tokenCount: 100,
          embedding: [0.1, 0.2],
        },
        {
          documentId: 'doc-1',
          chunkId: 'doc-1-chunk-2',
          chunkIndex: 2,
          content: 'Second chunk content',
          preview: 'Second preview',
          tokenCount: 140,
          embedding: [0.3, 0.4],
        },
      ],
    });
  });
});
