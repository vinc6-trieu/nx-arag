import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker, type Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';
import type {
  ProcessedIngestJob,
  SerializedIngestJob,
} from '../../domain/ingest-job.types';
import { RedisProvider } from '../../providers/redis.provider';
import { IngestQueueService } from '../queue/ingest-queue.service';
import { IngestStatusRepository } from '../status/ingest-status.repository';
import { SourceStorageService } from '../storage/source-storage.service';
import { ChunkingService } from '../chunking/chunking.service';
import { ContentExtractionService } from '../content/content-extraction.service';
import { EmbeddingService } from '../embedding/embedding.service';
import {
  DocumentPersistenceService,
  type PersistedChunkRecord,
} from '../persistence/document-persistence.service';

@Injectable()
export class IngestWorkerService implements OnModuleInit, OnModuleDestroy {
  private worker?: Worker<SerializedIngestJob, ProcessedIngestJob>;
  private s3Client?: S3Client;
  private readonly httpDownloadTimeoutMs = 30_000;

  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly queueService: IngestQueueService,
    private readonly statusRepository: IngestStatusRepository,
    private readonly storageService: SourceStorageService,
    private readonly contentExtractor: ContentExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
    private readonly persistenceService: DocumentPersistenceService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IngestWorkerService.name);
  }

  async onModuleInit(): Promise<void> {
    this.worker = new Worker<SerializedIngestJob, ProcessedIngestJob>(
      this.queueService.getQueueName(),
      (job) => this.handle(job),
      {
        connection: this.redisProvider.duplicate(),
        concurrency: 2,
      },
    );

    this.worker.on('failed', async (job, err) => {
      if (!job?.id) {
        this.logger.error(
          { err: err?.stack ?? String(err) },
          'Ingestion job failed without identifier',
        );
        return;
      }

      await this.statusRepository.writeStatus({
        jobId: job.id,
        documentId: job.data?.documentId ?? job.id,
        status: 'failed',
        errorMessage: err?.message ?? 'Unknown error',
        chunks: [],
      });

      this.logger.error(
        {
          jobId: job.id,
          documentId: job.data?.documentId,
          err: err?.stack ?? String(err),
        },
        'Ingestion job failed',
      );
    });

    await this.worker.waitUntilReady();

    this.logger.info(
      {
        queue: this.queueService.getQueueName(),
      },
      'Ingest worker ready',
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }

  private async handle(
    job: Job<SerializedIngestJob, ProcessedIngestJob>,
  ): Promise<ProcessedIngestJob> {
    if (!job.id) {
      throw new Error('Ingestion job is missing identifier');
    }

    await this.statusRepository.writeStatus({
      jobId: job.id,
      documentId: job.data.documentId,
      status: 'processing',
      chunks: [],
    });

    const sourceBuffer = await this.loadSourceBuffer(job.data);
    const sourceLocation = await this.storageService.persistSource(
      job.data,
      sourceBuffer,
    );

    const textContent = await this.contentExtractor.extractText(
      job.data,
      sourceBuffer,
    );

    const chunkCandidates = this.chunkingService.chunkText(
      job.data.documentId,
      textContent,
    );

    const chunkRecords: PersistedChunkRecord[] = [];

    for (let index = 0; index < chunkCandidates.length; index += 1) {
      const candidate = chunkCandidates[index];
      const embedding = await this.embeddingService.generate(candidate.text);

      chunkRecords.push({
        chunkId: candidate.chunkId,
        index: index + 1,
        content: candidate.text,
        preview: candidate.preview,
        tokenCount: candidate.tokenCount,
        embedding,
      });
    }

    const chunkSummaries = chunkRecords.map((record) => ({
      chunkId: record.chunkId,
      tokenCount: record.tokenCount,
      preview: record.preview,
      embedding: record.embedding,
    }));

    await this.persistenceService.persist({
      documentId: job.data.documentId,
      tenantId: job.data.tenantId,
      requestedBy: job.data.requestedBy,
      title: job.data.title,
      contentType: job.data.contentType,
      visibility: job.data.visibility,
      retentionPolicy: job.data.retentionPolicy,
      metadata: job.data.metadata,
      sourceUri: sourceLocation,
      ...this.extractSourceDetails(sourceLocation),
      chunks: chunkRecords,
    });

    await this.statusRepository.writeStatus({
      jobId: job.id,
      documentId: job.data.documentId,
      status: 'completed',
      chunks: chunkSummaries,
    });

    this.logger.debug(
      {
        jobId: job.id,
        documentId: job.data.documentId,
        chunkCount: chunkSummaries.length,
        sourceLocation,
      },
      'Completed ingestion pipeline',
    );

    return {
      jobId: job.id,
      documentId: job.data.documentId,
      sourceLocation,
      chunkSummaries,
    };
  }

  private async loadSourceBuffer(job: SerializedIngestJob): Promise<Buffer> {
    const { source } = job;

    if (source.kind === 'inline') {
      return Buffer.from(source.base64Data, 'base64');
    }

    if (!source.uri?.trim()) {
      throw new Error('Remote source URI is missing');
    }

    const uri = source.uri.trim();

    if (uri.startsWith('data:')) {
      const { buffer, contentType } = this.loadDataUri(uri);
      this.applyContentType(job, contentType);
      return buffer;
    }

    let parsed: URL;
    try {
      parsed = new URL(uri);
    } catch {
      throw new Error(`Invalid remote source URI: ${uri}`);
    }

    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      const { buffer, contentType } = await this.fetchHttpUri(parsed);
      this.applyContentType(job, contentType);
      return buffer;
    }

    if (parsed.protocol === 's3:') {
      const { buffer, contentType } = await this.fetchS3Uri(parsed);
      this.applyContentType(job, contentType);
      return buffer;
    }

    throw new Error(
      `Unsupported remote source scheme: ${parsed.protocol || 'unknown'}`,
    );
  }

  private applyContentType(
    job: SerializedIngestJob,
    inferredContentType?: string | null,
  ): void {
    if (job.contentType || !inferredContentType) {
      return;
    }

    const normalized = inferredContentType.split(';')[0]?.trim();
    if (normalized) {
      job.contentType = normalized;
    }
  }

  private extractSourceDetails(
    uri: string,
  ): { sourceBucket?: string; sourceKey?: string } {
    try {
      const parsed = new URL(uri);
      if (parsed.protocol !== 's3:') {
        return {};
      }

      const bucket = parsed.hostname || undefined;
      const key = parsed.pathname ? parsed.pathname.replace(/^\/+/, '') : '';

      return {
        sourceBucket: bucket,
        sourceKey: key || undefined,
      };
    } catch {
      return {};
    }
  }

  private loadDataUri(uri: string): { buffer: Buffer; contentType?: string } {
    const commaIndex = uri.indexOf(',');
    if (commaIndex === -1) {
      throw new Error('Malformed data URI source');
    }

    const metadata = uri.slice(5, commaIndex);
    const payload = uri.slice(commaIndex + 1);
    const isBase64 = metadata.endsWith(';base64');
    const contentType = metadata.split(';')[0] || undefined;

    if (isBase64) {
      return {
        buffer: Buffer.from(payload, 'base64'),
        contentType,
      };
    }

    return {
      buffer: Buffer.from(decodeURIComponent(payload), 'utf8'),
      contentType,
    };
  }

  private async fetchHttpUri(
    url: URL,
  ): Promise<{ buffer: Buffer; contentType?: string | null }> {
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      this.httpDownloadTimeoutMs,
    );

    try {
      const response = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `Failed to download remote source: HTTP ${response.status} ${response.statusText}`,
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      return {
        buffer: Buffer.from(arrayBuffer),
        contentType: response.headers.get('content-type'),
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(
          `Timed out downloading remote source from ${url.toString()}`,
        );
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async fetchS3Uri(
    url: URL,
  ): Promise<{ buffer: Buffer; contentType?: string | null }> {
    const bucket = url.hostname;
    const key = decodeURIComponent(url.pathname.replace(/^\/+/, ''));

    if (!bucket || !key) {
      throw new Error(`Invalid S3 URI: ${url.toString()}`);
    }

    const client = this.getS3Client();
    const response = await client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );

    const body = await this.streamToBuffer(response.Body);

    return {
      buffer: body,
      contentType: response.ContentType,
    };
  }

  private getS3Client(): S3Client {
    if (this.s3Client) {
      return this.s3Client;
    }

    const endpoint =
      this.configService.get<string>('INGEST_S3_ENDPOINT') ??
      'http://127.0.0.1:9000';
    const region =
      this.configService.get<string>('INGEST_S3_REGION') ?? 'ap-southeast-1';
    const accessKeyId =
      this.configService.get<string>('INGEST_S3_ACCESS_KEY_ID') ?? '';
    const secretAccessKey =
      this.configService.get<string>('INGEST_S3_SECRET_ACCESS_KEY') ?? '';

    this.s3Client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });

    return this.s3Client;
  }

  private async streamToBuffer(
    body:
      | Readable
      | Uint8Array
      | Buffer
      | string
      | { transformToByteArray?: () => Promise<Uint8Array> }
      | null
      | undefined,
  ): Promise<Buffer> {
    if (!body) {
      throw new Error('S3 object body is empty');
    }

    if (Buffer.isBuffer(body)) {
      return body;
    }

    if (body instanceof Uint8Array) {
      return Buffer.from(body);
    }

    if (typeof body === 'string') {
      return Buffer.from(body);
    }

    if (body instanceof Readable) {
      const chunks: Buffer[] = [];
      for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      }
      return Buffer.concat(chunks);
    }

    const transformToByteArray = (
      body as {
        transformToByteArray?: () => Promise<Uint8Array>;
      }
    ).transformToByteArray;

    if (typeof transformToByteArray === 'function') {
      const array = await transformToByteArray();
      return Buffer.from(array);
    }

    throw new Error('Unsupported stream type for S3 object body');
  }
}
