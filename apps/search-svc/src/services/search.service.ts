import { SearchHealthStatus, SearchHitDto, SearchQueryInput, SearchQueryResponseDto } from '@lib/shared';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class SearchService {
  private readonly defaultBm25TopK: number;
  private readonly defaultVectorTopK: number;
  private readonly defaultFinalTopK: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(SearchService.name);
    this.defaultBm25TopK = this.configService.get<number>(
      'SEARCH_DEFAULT_BM25_TOPK',
      20,
    );
    this.defaultVectorTopK = this.configService.get<number>(
      'SEARCH_DEFAULT_VECTOR_TOPK',
      50,
    );
    this.defaultFinalTopK = this.configService.get<number>(
      'SEARCH_DEFAULT_FINAL_TOPK',
      8,
    );
  }

  async query(request: SearchQueryInput): Promise<SearchQueryResponseDto> {
    const started = Date.now();

    const bm25TopK = request.bm25TopK ?? this.defaultBm25TopK;
    const vectorTopK = request.vectorTopK ?? this.defaultVectorTopK;
    const finalTopK = request.finalTopK ?? this.defaultFinalTopK;

    const hits = this.buildStubbedHits(request, finalTopK);
    const latencyMs = Date.now() - started;

    this.logger.debug({
      query: request.query,
      filters: request.filters,
      bm25TopK,
      vectorTopK,
      finalTopK,
      hitCount: hits.length,
    }, 'Handled stubbed search query');

    return {
      hits,
      latencyMs,
    };
  }

  health(): SearchHealthStatus {
    return { status: 'ok' };
  }

  private buildStubbedHits(
    request: SearchQueryInput,
    finalTopK: number,
  ): SearchHitDto[] {
    if (!request.query?.trim()) {
      return [];
    }

    const normalizedFilters = request.filters ?? {};
    const highlight = request.query.slice(0, 120);

    const docIdParts = [
      'stub',
      ...Object.entries(normalizedFilters).map(([key, value]) => `${key}-${value}`),
    ];

    const docIdBase = docIdParts.join('-') || 'stubbed-doc';

    const cappedFinalTopK = Math.max(finalTopK, 0);

    if (cappedFinalTopK === 0) {
      return [];
    }

    const results: SearchHitDto[] = Array.from({ length: cappedFinalTopK }).map((_, idx) => ({
      docId: `${docIdBase}-${idx + 1}`,
      chunkId: `chunk-${idx + 1}`,
      title: `Stubbed result ${idx + 1}`,
      snippet: `This is a placeholder search result for query "${request.query}".`,
      score: Number((Math.max(1 - idx * 0.05, 0.1)).toFixed(4)),
      highlights: [highlight],
    }));

    return results;
  }
}
