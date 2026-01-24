import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { FestivalApiResponse } from './dto/festival-api.response';
import { FestivalApiRequest } from './dto/festival-api.request';

@Injectable()
export class SeoulOpenDataClient {
  private readonly logger = new Logger(SeoulOpenDataClient.name);
  private readonly http: AxiosInstance;

  constructor(private readonly config: ConfigService) {
    this.http = axios.create({
      timeout: this.timeoutMs, // 안정화: env로 조절 가능
    });
  }

  private get baseUrl(): string {
    return this.config.get<string>('SEOUL_OPEN_API_BASE_URL', 'http://openapi.seoul.go.kr:8088');
  }

  private get dataset(): string {
    return this.config.get<string>('SEOUL_OPEN_API_DATASET', 'culturalEventInfo');
  }

  private get apiKey(): string {
    const key = this.config.get<string>('SEOUL_OPEN_API_KEY');
    if (!key) throw new Error('SEOUL_OPEN_API_KEY is required');
    return key;
  }

  private get timeoutMs(): number {
    return Number(this.config.get<string>('SEOUL_OPEN_API_TIMEOUT_MS', '10000'));
  }

  private get maxRetries(): number {
    return Number(this.config.get<string>('SEOUL_OPEN_API_MAX_RETRIES', '3'));
  }

  private get retryBaseDelayMs(): number {
    return Number(this.config.get<string>('SEOUL_OPEN_API_RETRY_BASE_DELAY_MS', '300'));
  }

  private safeUrl(start: number, end: number): string {
    // 민감정보(API KEY)는 로그에 절대 출력 금지
    return `${this.baseUrl}/<redacted>/json/${this.dataset}/${start}/${end}`;
  }

  private isRetryable(error: unknown): { retryable: boolean; status?: number } {
    const err = error as AxiosError | undefined;
    const status = err?.response?.status;

    // 네트워크 에러(응답 없음) 또는 5xx 또는 429
    if (!status) return { retryable: true };
    if (status === 429) return { retryable: true, status };
    if (status >= 500) return { retryable: true, status };
    return { retryable: false, status };
  }

  private getRetryAfterMs(error: unknown): number | null {
    const err = error as AxiosError | undefined;
    const h = (err?.response?.headers as any) || {};
    const retryAfter = h['retry-after'];
    if (!retryAfter) return null;

    const asNum = Number(retryAfter);
    if (Number.isFinite(asNum)) return Math.max(0, asNum * 1000);

    const asDate = Date.parse(String(retryAfter));
    if (!Number.isNaN(asDate)) return Math.max(0, asDate - Date.now());

    return null;
  }

  private async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async fetchFestivalData(req: FestivalApiRequest): Promise<FestivalApiResponse> {
    const url = `${this.baseUrl}/${this.apiKey}/json/${this.dataset}/${req.start}/${req.end}`;
    const safeUrl = this.safeUrl(req.start, req.end);

    const maxAttempts = Math.max(1, this.maxRetries);
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const startedAt = Date.now();
      try {
        const res = await this.http.get<FestivalApiResponse>(url);
        const ms = Date.now() - startedAt;
        this.logger.log(
          JSON.stringify({
            event: 'seoul_open_api',
            url: safeUrl,
            attempt,
            ms,
            status: res.status,
          }),
        );
        return res.data;
      } catch (e) {
        lastError = e;
        const ms = Date.now() - startedAt;
        const { retryable, status } = this.isRetryable(e);

        this.logger.warn(
          JSON.stringify({
            event: 'seoul_open_api_error',
            url: safeUrl,
            attempt,
            ms,
            status,
            retryable,
          }),
        );

        if (!retryable || attempt >= maxAttempts) break;

        // 지수 백오프 + jitter
        const base = this.retryBaseDelayMs * Math.pow(2, attempt - 1);
        const jitter = Math.floor(Math.random() * Math.min(250, base));
        let delay = base + jitter;

        // 429: Retry-After 우선
        if (status === 429) {
          const ra = this.getRetryAfterMs(e);
          if (ra !== null) delay = ra;
        }

        await this.sleep(delay);
      }
    }

    throw lastError;
  }
}

