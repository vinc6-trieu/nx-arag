import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Worker, type Job } from 'bullmq';
import { Buffer } from 'node:buffer';
import { PinoLogger } from 'nestjs-pino';
import { RedisProvider } from '../../providers/redis.provider';
import { IngestQueueService } from '../queue/ingest-queue.service';
import { IngestStatusRepository } from '../status/ingest-status.repository';
import { SourceStorageService } from '../storage/source-storage.service';
import { ContentExtractionService } from '../content/content-extraction.service';
import { ChunkingService } from '../chunking/chunking.service';
import { EmbeddingService } from '../embedding/embedding.service';
import type {
  ProcessedIngestJob,
  SerializedIngestJob,
} from '../../domain/ingest-job.types';

@Injectable()
export class IngestWorkerService
  implements OnModuleInit, OnModuleDestroy
{
  private worker?: Worker<SerializedIngestJob, ProcessedIngestJob>;

  constructor(
    private readonly redisProvider: RedisProvider,
    private readonly queueService: IngestQueueService,
    private readonly statusRepository: IngestStatusRepository,
    private readonly storageService: SourceStorageService,
    private readonly contentExtractor: ContentExtractionService,
    private readonly chunkingService: ChunkingService,
    private readonly embeddingService: EmbeddingService,
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

    const sourceBuffer = await this.loadSourceBuffer(job.data.source);
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

    const chunkSummaries = chunkCandidates.map((candidate) => ({
      chunkId: candidate.chunkId,
      tokenCount: candidate.tokenCount,
      preview: candidate.preview,
      embedding: this.embeddingService.generate(candidate.text),
    }));

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

  private async loadSourceBuffer(
    source: SerializedIngestJob['source'],
  ): Promise<Buffer> {
    if (source.kind === 'inline') {
      return Buffer.from(source.base64Data, 'base64');
    }

    throw new Error('Remote URI ingestion is not yet implemented');
  }
}
