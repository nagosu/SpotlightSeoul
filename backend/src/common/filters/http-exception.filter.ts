import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { FieldError, CustomExceptionPayload } from '../dto/error-response';

/**
 * HTTP 상태 코드 → 기본 에러 코드 매핑
 */
function getErrorCode(status: number, customCode?: string): string {
  if (customCode) return customCode;

  switch (status) {
    case HttpStatus.BAD_REQUEST:
      return 'BAD_REQUEST';
    case HttpStatus.UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case HttpStatus.FORBIDDEN:
      return 'FORBIDDEN';
    case HttpStatus.NOT_FOUND:
      return 'NOT_FOUND';
    case HttpStatus.CONFLICT:
      return 'CONFLICT';
    case HttpStatus.UNPROCESSABLE_ENTITY:
      return 'UNPROCESSABLE_ENTITY';
    default:
      return status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR';
  }
}

/**
 * 예외에서 메시지와 errors 배열을 추출
 */
function extractDetails(exception: unknown): {
  message: string;
  errors?: FieldError[];
  customCode?: string;
} {
  if (exception instanceof HttpException) {
    const res = exception.getResponse() as
      | string
      | CustomExceptionPayload
      | { message?: string | string[]; error?: string; [key: string]: unknown };

    if (typeof res === 'string') {
      return { message: res };
    }

    const customCode = (res as CustomExceptionPayload)?.code;
    const errors = (res as CustomExceptionPayload)?.errors;

    const msg = res?.message;
    if (Array.isArray(msg)) {
      // ValidationPipe의 exceptionFactory에서 넘긴 errors가 있으면 사용
      if (errors && errors.length > 0) {
        return {
          message: '요청 값이 올바르지 않습니다.',
          errors,
          customCode: customCode ?? 'VALIDATION_ERROR',
        };
      }
      // errors가 없으면 message 배열 자체를 errors로 변환 (legacy 호환)
      return {
        message: '요청 값이 올바르지 않습니다.',
        errors: msg.map((m) => ({ field: 'unknown', reason: m })),
        customCode: customCode ?? 'VALIDATION_ERROR',
      };
    }

    if (typeof msg === 'string') {
      return { message: msg, errors, customCode };
    }

    return { message: exception.message || 'Error', errors, customCode };
  }

  if (exception && typeof exception === 'object' && 'message' in exception) {
    const msg = (exception as any).message;
    if (typeof msg === 'string') return { message: msg };
  }

  return { message: 'Internal server error' };
}

/**
 * 전역 예외 필터
 * - 모든 예외를 표준 에러 응답 포맷으로 변환
 * - 응답 형태(snake_case): { request_id, status_code, code, message, errors? }
 * - 예외 필터에서 직접 snake_case로 작성합니다. (인터셉터 미적용)
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request & { requestId?: string }>();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const { message, errors, customCode } = extractDetails(exception);
    const code = getErrorCode(status, customCode);
    const requestId = request.requestId ?? 'unknown';

    // 5xx 에러는 로그 기록 (운영 디버깅용)
    if (status >= 500) {
      this.logger.error(
        `[${requestId}] ${status} ${code}: ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    // 표준 에러 응답 반환
    // SnakeCaseInterceptor가 필터 응답에는 적용되지 않으므로 직접 snake_case로 작성
    const body: Record<string, unknown> = {
      request_id: requestId,
      status_code: status,
      code,
      message,
    };
    if (errors && errors.length > 0) {
      body.errors = errors;
    }

    response.status(status).json(body);
  }
}
