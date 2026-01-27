import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 필드 단위 검증 오류 정보
 */
export class FieldError {
  @ApiProperty({ description: '오류가 발생한 필드명', example: 'email' })
  field: string;

  @ApiProperty({ description: '오류 사유', example: 'must be an email' })
  reason: string;
}

/**
 * 표준 에러 응답 포맷
 * - SnakeCaseInterceptor에 의해 실제 JSON은 snake_case로 변환됨
 *   (예: requestId → request_id, statusCode → status_code)
 */
export class ErrorResponse {
  @ApiProperty({ description: '요청 추적 ID', example: 'uuid-string' })
  requestId: string;

  @ApiProperty({ description: 'HTTP 상태 코드', example: 400 })
  statusCode: number;

  @ApiProperty({
    description: '에러 코드 (분기용)',
    example: 'VALIDATION_ERROR',
  })
  code: string;

  @ApiProperty({ description: '에러 메시지 (사용자 노출 가능)', example: '요청 값이 올바르지 않습니다.' })
  message: string;

  @ApiPropertyOptional({
    description: '필드 단위 검증 오류 목록 (Validation 에러 시에만 포함)',
    type: () => [FieldError],
    example: [{ field: 'email', reason: 'must be an email' }],
  })
  errors?: FieldError[];
}

/**
 * HttpException 생성 시 response로 넘길 수 있는 커스텀 payload 타입
 * - HttpExceptionFilter에서 이 형태를 인식하여 표준 에러 응답으로 변환
 */
export interface CustomExceptionPayload {
  code?: string;
  message?: string | string[];
  errors?: FieldError[];
}
