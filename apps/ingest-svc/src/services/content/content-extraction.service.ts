import { Injectable } from '@nestjs/common';
import { SerializedIngestJob } from '../../domain/ingest-job.types';

@Injectable()
export class ContentExtractionService {
  async extractText(
    job: SerializedIngestJob,
    buffer: Buffer,
  ): Promise<string> {
    if (!buffer.length) {
      return '';
    }

    const contentType = job.contentType ?? 'text/plain';

    if (contentType.startsWith('text/')) {
      return buffer.toString('utf8');
    }

    // TODO: integrate MinerU/Docling or similar for non-text formats.
    return buffer.toString('utf8');
  }
}
