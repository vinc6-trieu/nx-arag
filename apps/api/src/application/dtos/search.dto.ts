import type { SearchQueryInput } from '@lib/shared';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class SearchRequestDto implements SearchQueryInput {
  @IsString()
  query!: string;

  @IsOptional()
  @IsObject()
  filters?: Record<string, string>;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  bm25TopK?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  vectorTopK?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  finalTopK?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  useGraphBoost?: boolean;
}
