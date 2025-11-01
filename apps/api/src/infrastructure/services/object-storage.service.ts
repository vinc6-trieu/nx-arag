import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { URL } from 'node:url';
import {
  OBJECT_STORAGE_SERVICE,
  type ObjectStorageServicePort,
  type UploadDocumentSourceInput,
  type UploadDocumentSourceResult,
} from '../../domain/services/object-storage.service.interface';

@Injectable()
export class ObjectStorageService implements ObjectStorageServicePort {
  static readonly TOKEN = OBJECT_STORAGE_SERVICE;

  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ObjectStorageService.name);

    const endpoint =
      this.configService.get<string>('S3_ENDPOINT') ?? 'http://127.0.0.1:9000';
    const region = this.resolveRegion(endpoint);

    this.logger.info(
      {
        endpoint,
      },
      'endpoint',
    );

    this.client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: this.resolveCredentials(),
    });

    this.bucketName =
      this.configService.get<string>('S3_BUCKET_SOURCE') ?? 'documents';
  }

  async uploadDocumentSource(
    input: UploadDocumentSourceInput,
  ): Promise<UploadDocumentSourceResult> {
    const documentId = input.documentId?.trim() || randomUUID();
    const normalizedContentType =
      input.contentType?.trim() ||
      this.inferContentType(input.originalName) ||
      'application/octet-stream';

    const extension =
      this.extractExtensionFromName(input.originalName) ??
      this.extractExtensionFromContentType(normalizedContentType) ??
      'bin';

    const objectKey = `documents/${documentId}/source.${extension}`;

    this.logger.info(
      {
        input,
      },
      'input',
    );

    const metadata = this.buildMetadata({
      tenantId: input.tenantId,
      requestedBy: input.requestedBy,
      originalName: input.originalName,
      ...input.metadata,
    });

    this.logger.info(
      {
        metadata,
      },
      'metadata',
    );

    const putCommandInput: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: input.data,
      ContentType: normalizedContentType,
      Metadata: Object.keys(metadata).length ? metadata : undefined,
    };

    try {
      await this.client.send(new PutObjectCommand(putCommandInput));
    } catch (error) {
      this.logger.error(
        {
          error,
          bucket: this.bucketName,
          key: objectKey,
          documentId,
        },
        'Failed to upload document source to object storage',
      );
      throw new InternalServerErrorException('Failed to store document source');
    }

    return {
      documentId,
      bucket: this.bucketName,
      key: objectKey,
      uri: `s3://${this.bucketName}/${objectKey}`,
      size: input.data.byteLength,
      contentType: normalizedContentType,
    };
  }

  private resolveCredentials():
    | { accessKeyId: string; secretAccessKey: string }
    | undefined {
    const accessKeyId =
      this.configService.get<string>('S3_ACCESS_KEY_ID') ?? '';
    const secretAccessKey =
      this.configService.get<string>('S3_SECRET_ACCESS_KEY') ?? '';

    if (!accessKeyId || !secretAccessKey) {
      return undefined;
    }

    return { accessKeyId, secretAccessKey };
  }

  private inferContentType(originalName: string): string | undefined {
    const extension = this.extractExtensionFromName(originalName) ?? '';

    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'txt':
        return 'text/plain';
      case 'md':
        return 'text/markdown';
      case 'json':
        return 'application/json';
      case 'csv':
        return 'text/csv';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'gif':
        return 'image/gif';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'ppt':
        return 'application/vnd.ms-powerpoint';
      case 'pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      default:
        return undefined;
    }
  }

  private extractExtensionFromName(originalName: string): string | undefined {
    const extension = extname(originalName)?.replace('.', '').trim();
    return extension ? extension.toLowerCase() : undefined;
  }

  private extractExtensionFromContentType(
    contentType: string,
  ): string | undefined {
    const subtype = contentType.split('/')[1]?.trim();
    if (!subtype) {
      return undefined;
    }

    return subtype.split('+')[0]?.toLowerCase() ?? undefined;
  }

  private buildMetadata(
    metadata: Record<string, string | undefined>,
  ): Record<string, string> {
    return Object.entries(metadata).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value === undefined || value === null || value === '') {
          return acc;
        }

        acc[key.toLowerCase()] = String(value);
        return acc;
      },
      {},
    );
  }

  private resolveRegion(endpoint?: string): string {
    const configuredRegion = this.configService
      .get<string>('S3_REGION')
      ?.trim();
    if (configuredRegion) {
      return configuredRegion;
    }

    const derivedRegion = endpoint
      ? this.extractRegionFromEndpoint(endpoint)
      : undefined;
    if (derivedRegion) {
      return derivedRegion;
    }

    return 'ap-southeast-1';
  }

  private extractRegionFromEndpoint(endpoint: string): string | undefined {
    try {
      const { hostname } = new URL(endpoint);
      const match = hostname.match(
        /^s3[.-](?:dualstack[.-])?([a-z0-9-]+)\.amazonaws\.com$/i,
      );
      return match?.[1]?.toLowerCase();
    } catch (error) {
      this.logger.debug(
        { endpoint, error },
        'Failed to derive S3 region from endpoint; falling back to default',
      );
      return undefined;
    }
  }
}
