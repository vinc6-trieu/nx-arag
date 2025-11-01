import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { request as httpRequest, type RequestOptions } from 'node:http';
import { request as httpsRequest } from 'node:https';
import { URL } from 'node:url';

interface ProviderEmbeddingResponse {
  data?: Array<{
    embedding?: number[];
  }>;
}

@Injectable()
export class EmbeddingService {
  private readonly model: string;
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly defaultDimensions: number;
  private readonly maxTokens: number;
  private readonly maxCharacters: number;
  private readonly requestTimeoutMs = 15_000;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(EmbeddingService.name);

    this.model =
      this.configService.get<string>('INGEST_EMBED_MODEL') ??
      'text-embedding-3-small';
    this.apiUrl =
      this.configService.get<string>('INGEST_EMBED_API_URL') ??
      'https://api.openai.com/v1/embeddings';
    this.defaultDimensions =
      this.configService.get<number>('INGEST_EMBED_DIMENSIONS') ?? 1536;
    this.maxTokens =
      this.configService.get<number>('INGEST_EMBED_MAX_TOKENS') ?? 7000;
    this.maxCharacters = Math.ceil(this.maxTokens * 4.1);
    this.apiKey = this.configService.get<string>('AI_SERVICE_API_KEY') ?? '';

    if (!this.apiKey) {
      throw new Error(
        'AI_SERVICE_API_KEY is required for embedding generation',
      );
    }
  }

  async generate(
    text: string,
    dimensions = this.defaultDimensions,
  ): Promise<number[]> {
    const trimmed = text?.trim() ?? '';
    const targetDimensions = dimensions ?? this.defaultDimensions;

    if (!trimmed) {
      return Array(targetDimensions).fill(0);
    }

    const clamped = this.clampInput(trimmed);

    if (!clamped) {
      return Array(targetDimensions).fill(0);
    }

    try {
      const response = await this.invokeEmbeddingProvider({
        model: this.model,
        input: clamped,
      });

      const vector = response?.data?.[0]?.embedding;

      if (!vector || !Array.isArray(vector)) {
        this.logger.error(
          { response },
          'Embedding provider response does not include embedding data',
        );
        throw new Error('Embedding provider response missing embedding data');
      }

      const sanitized = vector
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));

      return this.coerceDimensions(sanitized, targetDimensions);
    } catch (error) {
      this.logger.error(
        { err: error instanceof Error ? error.message : String(error) },
        'Failed to generate embedding',
      );
      throw error;
    }
  }

  private coerceDimensions(vector: number[], dimensions: number): number[] {
    if (vector.length === dimensions) {
      return vector;
    }

    if (vector.length > dimensions) {
      return vector.slice(0, dimensions);
    }

    if (vector.length === 0) {
      return Array(dimensions).fill(0);
    }

    const padded = vector.slice();
    while (padded.length < dimensions) {
      padded.push(0);
    }
    return padded;
  }

  private clampInput(text: string): string {
    if (!text) {
      return '';
    }

    let result = text;
    let originalTokenCount: number | undefined;

    if (this.maxTokens > 0) {
      const tokens = text.split(/\s+/).filter((token) => token.length > 0);
      originalTokenCount = tokens.length;

      if (tokens.length > this.maxTokens) {
        result = tokens.slice(0, this.maxTokens).join(' ');
        this.logger.warn(
          {
            originalTokenCount,
            truncatedTokenCount: this.maxTokens,
          },
          'Embedding input truncated to max token limit',
        );
      }
    }

    if (result.length > this.maxCharacters) {
      const truncated = result.slice(0, this.maxCharacters);
      this.logger.warn(
        {
          originalLength: result.length,
          truncatedLength: truncated.length,
          reason: 'maxCharacters',
          priorTokenCount: originalTokenCount,
        },
        'Embedding input truncated to max character limit',
      );
      result = truncated;
    }

    return result.trim();
  }

  private invokeEmbeddingProvider(
    payload: Record<string, unknown>,
  ): Promise<ProviderEmbeddingResponse> {
    const url = new URL(this.apiUrl);
    const isHttps = url.protocol !== 'http:';
    const requestFn = isHttps ? httpsRequest : httpRequest;
    const options: RequestOptions = {
      hostname: url.hostname,
      port: url.port ? Number(url.port) : isHttps ? 443 : 80,
      path: `${url.pathname}${url.search}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify(payload);

    return new Promise((resolve, reject) => {
      const req = requestFn(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk: Buffer | string) => {
          chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk, 'utf-8') : chunk,
          );
        });

        res.on('error', (err) => {
          reject(err);
        });

        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf-8');
          let parsed: ProviderEmbeddingResponse | undefined;

          if (raw) {
            try {
              parsed = JSON.parse(raw) as ProviderEmbeddingResponse;
            } catch {
              this.logger.error(
                {
                  raw,
                  statusCode: res.statusCode,
                  statusMessage: res.statusMessage,
                },
                'Failed to parse embedding provider response JSON',
              );
              reject(
                new Error('Failed to parse embedding provider response JSON'),
              );
              return;
            }
          } else {
            parsed = {};
          }

          const statusCode = res.statusCode ?? 500;

          if (statusCode < 200 || statusCode >= 300) {
            this.logger.error(
              {
                statusCode,
                statusMessage: res.statusMessage,
                response: parsed,
              },
              'Embedding provider returned non-success response',
            );
            reject(
              new Error(
                `Embedding provider request failed: ${statusCode} ${res.statusMessage ?? ''}`.trim(),
              ),
            );
            return;
          }

          resolve(parsed);
        });
      });

      req.setTimeout(this.requestTimeoutMs, () => {
        req.destroy(new Error('Embedding provider request timed out'));
      });

      req.on('error', (err) => {
        reject(err);
      });

      try {
        req.write(body);
      } catch (error) {
        req.destroy(error instanceof Error ? error : new Error(String(error)));
        return;
      }

      req.end();
    });
  }
}
