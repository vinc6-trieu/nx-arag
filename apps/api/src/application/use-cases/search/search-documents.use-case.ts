import type { SearchQueryInput, SearchQueryResponseDto } from '@lib/shared';
import { Inject, Injectable } from '@nestjs/common';
import {
  SEARCH_SERVICE,
  SearchServicePort,
} from '../../../domain/services/search.service.interface';

@Injectable()
export class SearchDocumentsUseCase {
  constructor(
    @Inject(SEARCH_SERVICE)
    private readonly searchService: SearchServicePort,
  ) {}

  async execute(input: SearchQueryInput): Promise<SearchQueryResponseDto> {
    return this.searchService.query(input);
  }
}
