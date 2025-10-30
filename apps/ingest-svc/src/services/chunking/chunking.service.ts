import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChunkCandidate } from '../../domain/ingest-job.types';

const DEFAULT_CHUNK_TOKEN_LIMIT = 500;

@Injectable()
export class ChunkingService {
  private readonly chunkTokenLimit: number;

  constructor(private readonly configService: ConfigService) {
    this.chunkTokenLimit =
      this.configService.get<number>('INGEST_CHUNK_TOKEN_LIMIT') ??
      DEFAULT_CHUNK_TOKEN_LIMIT;
  }

  chunkText(documentId: string, text: string): ChunkCandidate[] {
    const tokens = this.tokenize(text);

    if (!tokens.length) {
      return [
        {
          chunkId: `${documentId}-chunk-1`,
          text,
          tokenCount: 0,
          preview: text.slice(0, 200),
        },
      ];
    }

    const results: ChunkCandidate[] = [];
    let buffer: string[] = [];

    for (const token of tokens) {
      buffer.push(token);

      if (buffer.length >= this.chunkTokenLimit) {
        results.push(this.buildChunk(documentId, results.length + 1, buffer));
        buffer = [];
      }
    }

    if (buffer.length > 0) {
      results.push(this.buildChunk(documentId, results.length + 1, buffer));
    }

    return results;
  }

  private tokenize(text: string): string[] {
    return text
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length > 0);
  }

  private buildChunk(
    documentId: string,
    index: number,
    tokens: string[],
  ): ChunkCandidate {
    const content = tokens.join(' ');
    return {
      chunkId: `${documentId}-chunk-${index}`,
      text: content,
      tokenCount: tokens.length,
      preview: content.slice(0, 200),
    };
  }
}
