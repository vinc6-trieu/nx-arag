import type { Multipart, MultipartFile } from '@fastify/multipart';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { FastifyRequest } from 'fastify';
import type { Buffer } from 'node:buffer';
import {
  SubmitDocumentRequestDto,
  toIngestDocumentInput,
} from '../../application/dtos/ingest.dto';
import { UploadDocumentRequestDto } from '../../application/dtos/upload.dto';
import { GetIngestJobStatusUseCase } from '../../application/use-cases/ingest/get-ingest-job-status.use-case';
import { IngestHealthUseCase } from '../../application/use-cases/ingest/ingest-health.use-case';
import { SubmitDocumentUseCase } from '../../application/use-cases/ingest/submit-document.use-case';
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
  async uploadDocument(@Req() req: FastifyRequest) {
    const { file, fields } = await this.consumeMultipartRequest(req);
    const dto = await this.validateBody(fields);

    const metadata = this.parseMetadata(dto.metadata);

    return this.uploadDocumentSourceUseCase.execute({
      buffer: file.buffer,
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

  private async consumeMultipartRequest(req: FastifyRequest): Promise<{
    file: { buffer: Buffer; filename: string; mimetype?: string };
    fields: Record<string, unknown>;
  }> {
    if (typeof req.isMultipart === 'function' && !req.isMultipart()) {
      throw new BadRequestException('Content-Type must be multipart/form-data');
    }

    const fields: Record<string, unknown> = {};
    let fileBuffer: Buffer | undefined;
    let fileMeta: Pick<MultipartFile, 'filename' | 'mimetype'> | undefined;

    const parts = (
      req as FastifyRequest & {
        parts: () => AsyncIterableIterator<Multipart>;
      }
    ).parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        const filePart = part as MultipartFile;

        if (filePart.fieldname !== 'file') {
          filePart.file.resume();
          continue;
        }

        if (fileBuffer) {
          filePart.file.resume();
          continue;
        }

        const buffer = await filePart.toBuffer();

        if (!buffer.length) {
          throw new BadRequestException('Uploaded file is empty');
        }

        if (filePart.file.truncated) {
          throw new BadRequestException(
            'Uploaded file exceeds configured size limit',
          );
        }

        fileBuffer = buffer;
        fileMeta = {
          filename: filePart.filename ?? 'upload',
          mimetype: filePart.mimetype,
        };
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    if (!fileBuffer || !fileMeta) {
      throw new BadRequestException('Request is missing required "file" field');
    }

    return {
      file: {
        buffer: fileBuffer,
        filename: fileMeta.filename,
        mimetype: fileMeta.mimetype,
      },
      fields,
    };
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
      if (
        Array.isArray(parsed) ||
        parsed === null ||
        typeof parsed !== 'object'
      ) {
        throw new Error('metadata must be a JSON object');
      }
      return parsed;
    } catch {
      throw new BadRequestException('metadata must be valid JSON object');
    }
  }
}
