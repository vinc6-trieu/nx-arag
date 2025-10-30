import {
  SEARCH_PACKAGE_NAME,
  SEARCH_PROTO_PATH,
  SEARCH_SERVICE_NAME,
  type SearchHealthStatus,
  type SearchQueryInput,
  type SearchQueryResponseDto,
} from '@lib/shared';
import { logErrorWithTelemetry } from '@lib/observability';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc, ClientsModule, Transport } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { lastValueFrom } from 'rxjs';
import {
  SEARCH_SERVICE,
  SearchServicePort,
} from '../../domain/services/search.service.interface';

export const SEARCH_GRPC_CLIENT_TOKEN = 'SEARCH_GRPC_CLIENT';

export const SearchGrpcClientModule = ClientsModule.registerAsync([
  {
    name: SEARCH_GRPC_CLIENT_TOKEN,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      transport: Transport.GRPC,
      options: {
        package: SEARCH_PACKAGE_NAME,
        protoPath: [SEARCH_PROTO_PATH],
        url: config.get<string>('SEARCH_SERVICE_GRPC_URL', '127.0.0.1:50051'),
      },
    }),
  },
]);

interface SearchGrpcClient {
  query(data: SearchQueryInput): import('rxjs').Observable<SearchQueryResponseDto>;
  health(data: Record<string, never>): import('rxjs').Observable<SearchHealthStatus>;
}

@Injectable()
export class SearchGrpcService
  implements SearchServicePort, OnModuleInit
{
  private client!: SearchGrpcClient;

  constructor(
    @Inject(SEARCH_GRPC_CLIENT_TOKEN) private readonly grpcClient: ClientGrpc,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SearchGrpcService.name);
  }

  onModuleInit(): void {
    this.client = this.grpcClient.getService<SearchGrpcClient>(SEARCH_SERVICE_NAME);
  }

  async query(input: SearchQueryInput): Promise<SearchQueryResponseDto> {
    try {
      return await lastValueFrom(this.client.query(input));
    } catch (error) {
      logErrorWithTelemetry(this.logger, error, {
        message: 'Failed to execute search query via gRPC',
        tags: ['rpc.system:grpc', 'rpc.service:search', 'rpc.method:Query'],
        context: { query: input.query },
      });
      throw error;
    }
  }

  async health(): Promise<SearchHealthStatus> {
    try {
      return await lastValueFrom(this.client.health({}));
    } catch (error) {
      logErrorWithTelemetry(this.logger, error, {
        message: 'Search gRPC health check failed',
        tags: ['rpc.system:grpc', 'rpc.service:search', 'rpc.method:Health'],
      });
      throw error;
    }
  }
}

export const SearchServiceProvider = {
  provide: SEARCH_SERVICE,
  useExisting: SearchGrpcService,
};
