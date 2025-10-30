import { Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';

const DEFAULT_DIMENSIONS = 16;

@Injectable()
export class EmbeddingService {
  generate(text: string, dimensions = DEFAULT_DIMENSIONS): number[] {
    if (!text) {
      return Array.from({ length: dimensions }).map(() => 0);
    }

    const hash = createHash('sha256').update(text).digest();
    const embedding: number[] = [];

    for (let index = 0; index < dimensions; index += 1) {
      const byte = hash[index] ?? 0;
      const normalized = byte / 127.5 - 1;
      embedding.push(Number(normalized.toFixed(6)));
    }

    return embedding;
  }
}
