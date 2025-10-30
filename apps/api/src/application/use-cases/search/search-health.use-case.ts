import type { SearchHealthStatus } from '@lib/shared';
import { Inject, Injectable } from '@nestjs/common';
import {
  SEARCH_SERVICE,
  SearchServicePort,
} from '../../../domain/services/search.service.interface';

@Injectable()
export class SearchHealthUseCase {
  constructor(
    @Inject(SEARCH_SERVICE)
    private readonly searchService: SearchServicePort,
  ) {}

  async execute(): Promise<SearchHealthStatus> {
    return this.searchService.health();
  }
}
