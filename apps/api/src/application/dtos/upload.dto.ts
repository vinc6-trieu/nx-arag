import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UploadDocumentRequestDto {
  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsOptional()
  @IsString()
  requestedBy?: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() ? value : undefined,
  )
  metadata?: string;
}
