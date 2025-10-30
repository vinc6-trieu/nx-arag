import type { IngestDocumentInput } from '@lib/shared';
import { BadRequestException } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsBase64,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Buffer } from 'node:buffer';

class IngestDocumentSourceDto {
  @IsEnum(['uri', 'inline'])
  kind!: 'uri' | 'inline';

  @ValidateIf((source) => source.kind === 'uri')
  @IsString()
  uri?: string;

  @ValidateIf((source) => source.kind === 'inline')
  @IsBase64()
  base64Data?: string;
}

export class SubmitDocumentRequestDto {
  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @ValidateNested()
  @Type(() => IngestDocumentSourceDto)
  source!: IngestDocumentSourceDto;

  @IsOptional()
  @IsString()
  contentType?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsString()
  retentionPolicy?: string;
}

export function toIngestDocumentInput(
  dto: SubmitDocumentRequestDto,
): IngestDocumentInput {
  if (!dto.source) {
    throw new BadRequestException('source is required');
  }

  const title = dto.title?.trim() || 'Untitled Document';

  const metadata = dto.metadata
    ? Object.entries(dto.metadata).reduce<Record<string, string>>(
        (acc, [key, value]) => {
          if (value === undefined || value === null) {
            return acc;
          }

          acc[key] = String(value);
          return acc;
        },
        {},
      )
    : undefined;

  if (dto.source.kind === 'inline') {
    if (!dto.source.base64Data) {
      throw new BadRequestException('base64Data is required for inline source');
    }

    const buffer = decodeBase64(dto.source.base64Data);

    return {
      title,
      tenantId: dto.tenantId?.trim() || undefined,
      requestedBy: dto.requestedBy?.trim() || undefined,
      documentId: dto.documentId?.trim() || undefined,
      source: {
        kind: 'inline',
        data: buffer,
      },
      contentType: dto.contentType?.trim() || undefined,
      metadata,
      visibility: dto.visibility?.trim() || undefined,
      retentionPolicy: dto.retentionPolicy?.trim() || undefined,
    };
  }

  const uri = dto.source.uri?.trim();
  if (!uri) {
    throw new BadRequestException('uri is required for uri source');
  }

  return {
    title,
    tenantId: dto.tenantId?.trim() || undefined,
    requestedBy: dto.requestedBy?.trim() || undefined,
    documentId: dto.documentId?.trim() || undefined,
    source: {
      kind: 'uri',
      uri,
    },
    contentType: dto.contentType?.trim() || undefined,
    metadata,
    visibility: dto.visibility?.trim() || undefined,
    retentionPolicy: dto.retentionPolicy?.trim() || undefined,
  };
}

function decodeBase64(encoded: string): Buffer {
  const sanitized = encoded.replace(/\s+/g, '');
  try {
    const buffer = Buffer.from(sanitized, 'base64');
    if (!buffer.length) {
      throw new Error('Decoded buffer is empty');
    }

    // Validate the round-trip encoding to catch malformed input.
    const reencoded = buffer.toString('base64').replace(/=+$/, '');
    const normalizedInput = sanitized.replace(/=+$/, '');
    if (reencoded !== normalizedInput) {
      throw new Error('Invalid base64 payload');
    }

    return buffer;
  } catch {
    throw new BadRequestException('Invalid base64 payload for inline source');
  }
}
