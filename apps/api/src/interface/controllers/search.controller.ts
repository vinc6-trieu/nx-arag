import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { SearchRequestDto } from '../../application/dtos/search.dto';
import { SearchDocumentsUseCase } from '../../application/use-cases/search/search-documents.use-case';
import { SearchHealthUseCase } from '../../application/use-cases/search/search-health.use-case';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchDocumentsUseCase: SearchDocumentsUseCase,
    private readonly searchHealthUseCase: SearchHealthUseCase,
  ) {}

  @Post()
  async search(@Body() body: SearchRequestDto) {
    return this.searchDocumentsUseCase.execute(body);
  }

  @Get('health')
  async health() {
    return this.searchHealthUseCase.execute();
  }
}
