import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SEARCH_SERVICE_NAME } from '@lib/shared';
import type {
  SearchHealthStatus,
  SearchQueryInput,
  SearchQueryResponseDto,
} from '@lib/shared';
import { SearchService } from '../services/search.service';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @GrpcMethod(SEARCH_SERVICE_NAME, 'Query')
  async query(request: SearchQueryInput): Promise<SearchQueryResponseDto> {
    return this.searchService.query(request);
  }

  @GrpcMethod(SEARCH_SERVICE_NAME, 'Health')
  health(): SearchHealthStatus {
    return this.searchService.health();
  }
}
