import type { IngestJobStatusDto } from '@lib/shared';
import {
  BadRequestException,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  INGEST_SERVICE,
  type IngestServicePort,
} from '../../../domain/services/ingest.service.interface';

@Injectable()
export class GetIngestJobStatusUseCase {
  constructor(
    @Inject(INGEST_SERVICE)
    private readonly ingestService: IngestServicePort,
  ) {}

  async execute(jobId?: string): Promise<IngestJobStatusDto> {
    const normalizedJobId = jobId?.trim();
    if (!normalizedJobId) {
      throw new BadRequestException('jobId is required');
    }

    return this.ingestService.getJobStatus(normalizedJobId);
  }
}

