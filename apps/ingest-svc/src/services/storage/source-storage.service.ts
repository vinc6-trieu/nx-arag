import {
  PutObjectCommand,
  S3Client,
  type PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { URL } from 'node:url';
import type { SerializedIngestJob } from '../../domain/ingest-job.types';

@Injectable()
export class SourceStorageService {
  private readonly client: S3Client;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private logger: PinoLogger,
  ) {
    const endpoint =
      this.configService.get<string>('INGEST_S3_ENDPOINT') ??
      'http://127.0.0.1:9000';
    const region = this.resolveRegion(endpoint);

    this.logger.info(
      {
        endpoint,
      },
      '  endpoint',
    );

    this.client = new S3Client({
      endpoint,
      region,
      forcePathStyle: true,
      credentials: this.resolveCredentials(),
    });

    this.bucketName =
      this.configService.get<string>('INGEST_S3_BUCKET_SOURCE') ?? 'documents';
  }

  async persistSource(
    job: SerializedIngestJob,
    buffer: Buffer,
  ): Promise<string> {
    const extension = job.contentType?.split('/')?.[1]?.trim() || 'bin';

    const key = `documents/${job.documentId}/source.${extension}`;

    const putCommand: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: job.contentType ?? 'application/octet-stream',
      Metadata: job.metadata ?? {},
    };

    await this.client.send(new PutObjectCommand(putCommand));

    return `s3://${this.bucketName}/${key}`;
  }

  private resolveCredentials():
    | {
        accessKeyId: string;
        secretAccessKey: string;
      }
    | undefined {
    const accessKeyId =
      this.configService.get<string>('INGEST_S3_ACCESS_KEY_ID') ?? '';
    const secretAccessKey =
      this.configService.get<string>('INGEST_S3_SECRET_ACCESS_KEY') ?? '';

    if (!accessKeyId || !secretAccessKey) {
      return undefined;
    }

    return { accessKeyId, secretAccessKey };
  }

  private resolveRegion(endpoint?: string): string {
    const configuredRegion = this.configService
      .get<string>('INGEST_S3_REGION')
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
    } catch {
      return undefined;
    }
  }
}
