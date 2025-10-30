import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, type Job } from 'bullmq';
import { PinoLogger } from 'nestjs-pino';
import { RedisProvider } from '../../providers/redis.provider';
import type {
  ProcessedIngestJob,
  SerializedIngestJob,
} from '../../domain/ingest-job.types';

const DEFAULT_QUEUE_NAME = 'ingest:jobs';
const JOB_NAME = 'ingest-document';

@Injectable()
export class IngestQueueService implements OnModuleInit, OnModuleDestroy {
  private queueName: string = DEFAULT_QUEUE_NAME;
  private queue?: Queue<SerializedIngestJob, ProcessedIngestJob>;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisProvider: RedisProvider,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IngestQueueService.name);
  }

  async onModuleInit(): Promise<void> {
    this.queueName =
      this.configService.get<string>('INGEST_QUEUE_NAME') ??
      DEFAULT_QUEUE_NAME;

    this.queue = new Queue<SerializedIngestJob, ProcessedIngestJob>(
      this.queueName,
      {
        connection: this.redisProvider.duplicate(),
        defaultJobOptions: {
          removeOnComplete: false,
          removeOnFail: false,
          attempts: 1,
        },
      },
    );

    await this.queue.waitUntilReady();

    this.logger.info(
      {
        queue: this.queueName,
      },
      'Ingest queue ready',
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }

  async enqueue(
    payload: SerializedIngestJob,
  ): Promise<Job<SerializedIngestJob, ProcessedIngestJob>> {
    const queue = this.getQueue();

    return queue.add(JOB_NAME, payload, {
      removeOnComplete: false,
      removeOnFail: false,
    });
  }

  getQueueName(): string {
    return this.queueName;
  }

  private getQueue(): Queue<SerializedIngestJob, ProcessedIngestJob> {
    if (!this.queue) {
      throw new Error('Ingest queue is not initialised');
    }

    return this.queue;
  }
}
