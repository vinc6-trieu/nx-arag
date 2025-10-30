import type { IngestHealthStatus } from '@lib/shared';
import { Inject, Injectable } from '@nestjs/common';
import {
  INGEST_SERVICE,
  type IngestServicePort,
} from '../../../domain/services/ingest.service.interface';

@Injectable()
export class IngestHealthUseCase {
  constructor(
    @Inject(INGEST_SERVICE)
    private readonly ingestService: IngestServicePort,
  ) {}

  async execute(): Promise<IngestHealthStatus> {
    return this.ingestService.health();
  }
}

