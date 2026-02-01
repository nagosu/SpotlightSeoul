import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import type { ApiError, FieldError } from './types/common';

function generateRequestId(): string | undefined {
  // 가능한 경우 브라우저 내장 UUID 생성기를 사용합니다.
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  // 폴백: getRandomValues 기반 RFC4122 v4 UUID 생성
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    // RFC4122 v4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
    return (
      `${hex.slice(0, 4).join('')}-` +
      `${hex.slice(4, 6).join('')}-` +
      `${hex.slice(6, 8).join('')}-` +
      `${hex.slice(8, 10).join('')}-` +
      `${hex.slice(10, 16).join('')}`
    );
  }

  // UUID를 생성할 수 없는 환경이면 헤더를 생략하고,
  // 서버에서 Request ID를 생성하도록 둡니다.
  return undefined;
}

// 서버 에러 바디(snake_case)를 ApiError(camelCase)로 정규화
function normalizeServerError(data: unknown): Partial<ApiError> {
  if (!data || typeof data !== 'object') return {};
  const d = data as Record<string, unknown>;
  return {
    request_id: d.request_id as string,
    status_code: d.status_code as number,
    code: d.code as string,
    message: d.message as string,
    errors: d.errors as FieldError[] | undefined,
  };
}

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // axios v1에서 headers는 AxiosHeaders일 수 있으므로 안전하게 정규화해서 사용
    const headers = AxiosHeaders.from(config.headers);
    config.headers = headers;

    // X-Request-Id 헤더 자동 추가 (없는 경우에만)
    if (!headers.get('X-Request-Id')) {
      const requestId = generateRequestId();
      if (requestId) {
        headers.set('X-Request-Id', requestId);
      }
    }

    // Authorization Bearer 토큰 자동 추가 (로컬스토리지에서 가져오기)
    if (config.withAuthToken === true) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  (error: AxiosError) => {
    const method = error.config?.method;
    const rawUrl = error.config?.url;
    const url =
      error.config?.baseURL && rawUrl
        ? `${error.config.baseURL}${rawUrl}`
        : rawUrl;

    const requestIdFromRequest = (() => {
      if (error.config?.headers == null) return undefined;
      const v = AxiosHeaders.from(error.config.headers).get('X-Request-Id');
      return typeof v === 'string' ? v : undefined;
    })();

    // 에러 응답 정규화 (호출부에는 ApiError만 노출)
    if (error.response) {
      const normalized = normalizeServerError(error.response.data);
      const requestIdFromHeader =
        error.response.headers != null
          ? (error.response.headers as Record<string, unknown>)['x-request-id']
          : undefined;
      const requestIdFromHeaderString =
        typeof requestIdFromHeader === 'string' ? requestIdFromHeader : undefined;

      const apiError: ApiError = {
        request_id:
          normalized.request_id ??
          requestIdFromHeaderString ??
          requestIdFromRequest ??
          'unknown',
        status_code:
          normalized.status_code ?? error.response.status ?? 0,
        code: normalized.code ?? 'ERROR',
        message: normalized.message ?? '요청 중 오류가 발생했습니다.',
        errors: normalized.errors,
        httpStatus: error.response.status,
        method,
        url,
        raw: error,
      };

      return Promise.reject(apiError);
    }

    if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      const apiError: ApiError = {
        request_id: requestIdFromRequest ?? 'unknown',
        status_code: 0,
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.',
        httpStatus: 0,
        method,
        url,
        raw: error,
      };
      return Promise.reject(apiError);
    }

    // 요청 설정 중 오류 발생
    const apiError: ApiError = {
      request_id: requestIdFromRequest ?? 'unknown',
      status_code: 0,
      code: 'UNKNOWN_ERROR',
      message: '알 수 없는 오류가 발생했습니다.',
      httpStatus: 0,
      method,
      url,
      raw: error,
    };
    return Promise.reject(apiError);
  },
);

export default apiClient;
