import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import type { MultipartFile } from '@fastify/multipart';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { FastifyRequest } from 'fastify';
import { SubmitDocumentRequestDto, toIngestDocumentInput } from '../../application/dtos/ingest.dto';
import { SubmitDocumentUseCase } from '../../application/use-cases/ingest/submit-document.use-case';
import { GetIngestJobStatusUseCase } from '../../application/use-cases/ingest/get-ingest-job-status.use-case';
import { IngestHealthUseCase } from '../../application/use-cases/ingest/ingest-health.use-case';
import { UploadDocumentRequestDto } from '../../application/dtos/upload.dto';
import { UploadDocumentSourceUseCase } from '../../application/use-cases/ingest/upload-document-source.use-case';

@Controller('ingest')
export class IngestController {
  constructor(
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
    private readonly getIngestJobStatusUseCase: GetIngestJobStatusUseCase,
    private readonly ingestHealthUseCase: IngestHealthUseCase,
    private readonly uploadDocumentSourceUseCase: UploadDocumentSourceUseCase,
  ) {}

  @Post('documents')
  async submitDocument(@Body() body: SubmitDocumentRequestDto) {
    const input = toIngestDocumentInput(body);
    return this.submitDocumentUseCase.execute(input);
  }

  @Post('uploads')
  async uploadDocument(
    @Req() req: FastifyRequest,
  ) {
    const file = await this.getMultipartFile(req);
    const normalizedBody = this.normalizeMultipartBody(req.body);
    const dto = await this.validateBody(normalizedBody);

    const metadata = this.parseMetadata(dto.metadata);
    const buffer = await file.toBuffer();

    return this.uploadDocumentSourceUseCase.execute({
      buffer,
      originalName: file.filename,
      mimeType: file.mimetype,
      documentId: dto.documentId,
      tenantId: dto.tenantId,
      requestedBy: dto.requestedBy,
      metadata,
    });
  }

  @Get('jobs/:jobId')
  async getJobStatus(@Param('jobId') jobId: string) {
    return this.getIngestJobStatusUseCase.execute(jobId);
  }

  @Get('health')
  async health() {
    return this.ingestHealthUseCase.execute();
  }

  private async getMultipartFile(
    req: FastifyRequest,
  ): Promise<MultipartFile> {
    const fastifyRequest = req as FastifyRequest & {
      file: () => Promise<MultipartFile | undefined>;
    };

    const file = await fastifyRequest.file();
    if (!file) {
      throw new BadRequestException(
        'Request is missing required "file" field',
      );
    }

    return file;
  }

  private normalizeMultipartBody(
    body: FastifyRequest['body'],
  ): Record<string, unknown> {
    if (!body || typeof body !== 'object') {
      return {};
    }

    return Object.entries(body as Record<string, unknown>).reduce<
      Record<string, unknown>
    >((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const normalized = value.map((item) =>
          item && typeof item === 'object' && 'value' in item
            ? (item as { value: unknown }).value
            : item,
        );

        acc[key] = normalized.length > 1 ? normalized : normalized[0];
        return acc;
      }

      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        'value' in value
      ) {
        acc[key] = (value as { value: unknown }).value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private async validateBody(
    body: Record<string, unknown>,
  ): Promise<UploadDocumentRequestDto> {
    const dto = plainToInstance(UploadDocumentRequestDto, body);
    const errors = await validate(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const firstError = errors[0];
      const constraints = firstError.constraints
        ? Object.values(firstError.constraints).join('; ')
        : 'Invalid request payload';
      throw new BadRequestException(constraints);
    }

    return dto;
  }

  private parseMetadata(
    metadata?: string,
  ): Record<string, unknown> | undefined {
    if (!metadata) {
      return undefined;
    }

    try {
      const parsed = JSON.parse(metadata);
      if (Array.isArray(parsed) || parsed === null || typeof parsed !== 'object') {
        throw new Error('metadata must be a JSON object');
      }
      return parsed;
    } catch {
      throw new BadRequestException(
        'metadata must be valid JSON object',
      );
    }
  }
}
