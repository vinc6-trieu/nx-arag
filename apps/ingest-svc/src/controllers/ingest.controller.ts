import {
  INGEST_SERVICE_NAME,
  type IngestHealthStatus,
  type IngestJobStatusDto,
  type SubmitDocumentResponseDto,
} from '@lib/shared';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { SubmitDocumentGrpcRequest } from '../domain/submit-document-request.type';
import { IngestService } from '../services/ingest.service';

@Controller()
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @GrpcMethod(INGEST_SERVICE_NAME, 'SubmitDocument')
  async submitDocument(
    request: SubmitDocumentGrpcRequest,
  ): Promise<SubmitDocumentResponseDto> {
    return this.ingestService.submitDocument(request);
  }

  @GrpcMethod(INGEST_SERVICE_NAME, 'GetJobStatus')
  async getJobStatus(request: { jobId?: string }): Promise<IngestJobStatusDto> {
    return this.ingestService.getJobStatus(request.jobId);
  }

  @GrpcMethod(INGEST_SERVICE_NAME, 'Health')
  health(): IngestHealthStatus {
    return this.ingestService.health();
  }
}
