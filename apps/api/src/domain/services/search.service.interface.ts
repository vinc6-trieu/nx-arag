import type {
  SearchHealthStatus,
  SearchQueryInput,
  SearchQueryResponseDto,
} from '@lib/shared';

export const SEARCH_SERVICE = Symbol('SEARCH_SERVICE');

export interface SearchServicePort {
  query(input: SearchQueryInput): Promise<SearchQueryResponseDto>;
  health(): Promise<SearchHealthStatus>;
}
