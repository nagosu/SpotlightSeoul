/**
 * 필드 단위 검증 오류
 */
export interface FieldError {
  /** 오류가 발생한 필드명 (예: "email") */
  field: string;
  /** 오류 사유 (예: "must be an email") */
  reason: string;
}

/**
 * 공통 에러 응답 (Swagger ErrorResponse 스키마 기반)
 */
export interface ErrorResponse {
  /** 요청 추적 ID */
  requestId: string;
  /** HTTP 상태 코드 (400, 401, 404, 500 등) */
  statusCode: number;
  /** 에러 코드 (분기용) - 예: "VALIDATION_ERROR", "NOT_FOUND" */
  code: string;
  /** 에러 메시지 (사용자 노출 가능) */
  message: string;
  /** 필드 단위 검증 오류 목록 (Validation 에러 시에만 포함) */
  errors?: FieldError[];
}

/**
 * API 에러 (서버 응답 + 클라이언트 메타)
 */
export interface ApiError extends ErrorResponse {
  /** HTTP 메타(디버깅용) */
  httpStatus?: number;
  method?: string;
  url?: string;

  /** 원본 에러(로그/디버깅용) */
  raw?: unknown;
}

/**
 * 페이지네이션 응답 포맷
 */
export interface PageResponse<T> {
  /** 전체 페이지 수 */
  total_page_num: number;
  /** 게시물 목록 */
  post_responses: T[];
}
