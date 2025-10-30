import type {
  IngestDocumentInput,
  SubmitDocumentResponseDto,
} from '@lib/shared';
import { Inject, Injectable } from '@nestjs/common';
import {
  INGEST_SERVICE,
  type IngestServicePort,
} from '../../../domain/services/ingest.service.interface';

@Injectable()
export class SubmitDocumentUseCase {
  constructor(
    @Inject(INGEST_SERVICE)
    private readonly ingestService: IngestServicePort,
  ) {}

  async execute(
    input: IngestDocumentInput,
  ): Promise<SubmitDocumentResponseDto> {
    return this.ingestService.submitDocument(input);
  }
}

