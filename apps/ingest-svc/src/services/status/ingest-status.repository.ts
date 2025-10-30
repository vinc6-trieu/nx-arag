import { Injectable } from '@nestjs/common';
import type { IngestChunkSummaryDto, IngestJobStatus } from '@lib/shared';
import { RedisProvider } from '../../providers/redis.provider';
import type { JobStatusRecord } from '../../domain/ingest-job.types';
import type { Redis } from 'ioredis';

const STATUS_TTL_SECONDS = 60 * 60 * 24; // 24 hours

interface PersistPayload {
  jobId: string;
  documentId: string;
  status: IngestJobStatus;
  errorMessage?: string;
  chunks?: IngestChunkSummaryDto[];
}

@Injectable()
export class IngestStatusRepository {
  private readonly redis: Redis;
  private readonly statusPrefix: string;

  constructor(private readonly redisProvider: RedisProvider) {
    this.redis = this.redisProvider.getClient();
    this.statusPrefix = 'ingest:jobs:status';
  }

  async writeStatus(payload: PersistPayload): Promise<void> {
    const key = this.buildKey(payload.jobId);
    const record: Record<string, string> = {
      jobId: payload.jobId,
      documentId: payload.documentId,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };

    if (payload.errorMessage) {
      record.errorMessage = payload.errorMessage;
    }

    if (payload.chunks) {
      record.chunks = JSON.stringify(payload.chunks);
    }

    await this.redis.hset(key, record);
    await this.redis.expire(key, STATUS_TTL_SECONDS);
  }

  async readStatus(jobId: string): Promise<JobStatusRecord | null> {
    const key = this.buildKey(jobId);
    const raw = await this.redis.hgetall(key);

    if (!raw || Object.keys(raw).length === 0) {
      return null;
    }

    return {
      jobId,
      documentId: raw.documentId ?? jobId,
      status: this.normalizeStatus(raw.status),
      errorMessage: raw.errorMessage,
      chunks: this.parseStoredChunks(raw.chunks),
      updatedAt: raw.updatedAt ?? new Date().toISOString(),
    };
  }

  private buildKey(jobId: string): string {
    return `${this.statusPrefix}:${jobId}`;
  }

  private normalizeStatus(status?: string): IngestJobStatus {
    switch (status) {
      case 'pending':
      case 'processing':
      case 'completed':
      case 'failed':
        return status;
      default:
        return 'unspecified';
    }
  }

  private parseStoredChunks(serialized?: string): IngestChunkSummaryDto[] | undefined {
    if (!serialized) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(serialized) as unknown;
      if (!Array.isArray(parsed)) {
        return undefined;
      }

      const summaries: IngestChunkSummaryDto[] = [];

      for (const candidate of parsed) {
        if (!candidate || typeof candidate !== 'object') {
          continue;
        }

        const entry = candidate as Record<string, unknown>;
        const chunkId =
          typeof entry.chunkId === 'string' ? entry.chunkId : undefined;

        if (!chunkId) {
          continue;
        }

        const tokenCount =
          typeof entry.tokenCount === 'number' ? entry.tokenCount : undefined;
        const preview =
          typeof entry.preview === 'string' ? entry.preview : undefined;

        const embedding =
          Array.isArray(entry.embedding) &&
          entry.embedding.every((value) => typeof value === 'number')
            ? (entry.embedding as number[])
            : undefined;

        summaries.push({
          chunkId,
          tokenCount,
          preview,
          embedding,
        });
      }

      return summaries.length ? summaries : undefined;
    } catch {
      return undefined;
    }
  }
}
