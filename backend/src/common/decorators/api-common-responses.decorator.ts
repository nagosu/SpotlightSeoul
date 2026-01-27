import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from '../dto/error-response';

/**
 * 공통 에러 응답 Swagger 문서화 데코레이터
 * - 400: Validation 에러 또는 잘못된 요청
 * - 401: 인증 실패
 * - 404: 리소스를 찾을 수 없음
 * - 500: 서버 내부 오류
 */
export function ApiCommonResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: '잘못된 요청 (Validation 에러 포함)',
      type: ErrorResponse,
    }),
    ApiUnauthorizedResponse({
      description: '인증 실패 (토큰 없음/만료/유효하지 않음)',
      type: ErrorResponse,
    }),
    ApiNotFoundResponse({
      description: '리소스를 찾을 수 없음',
      type: ErrorResponse,
    }),
    ApiInternalServerErrorResponse({
      description: '서버 내부 오류',
      type: ErrorResponse,
    }),
  );
}

/**
 * 인증이 필요한 엔드포인트용 공통 에러 응답
 * - ApiCommonResponses + 401 강조
 */
export function ApiAuthResponses() {
  return applyDecorators(ApiCommonResponses());
}

/**
 * 공개 엔드포인트용 공통 에러 응답 (401 제외)
 */
export function ApiPublicResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: '잘못된 요청 (Validation 에러 포함)',
      type: ErrorResponse,
    }),
    ApiNotFoundResponse({
      description: '리소스를 찾을 수 없음',
      type: ErrorResponse,
    }),
    ApiInternalServerErrorResponse({
      description: '서버 내부 오류',
      type: ErrorResponse,
    }),
  );
}
