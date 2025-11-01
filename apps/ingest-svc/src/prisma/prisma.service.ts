import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from './generated';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const url =
      configService.get<string>('INGEST_DATABASE_URL') ||
      configService.get<string>('DATABASE_URL');

    if (!url) {
      throw new Error(
        'INGEST_DATABASE_URL (or DATABASE_URL) must be set to initialise Prisma for ingest service',
      );
    }

    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
