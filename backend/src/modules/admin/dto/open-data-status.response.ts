import { ApiProperty } from '@nestjs/swagger';

export class OpenDataStatusResponse {
  @ApiProperty({ description: '상태', example: 'ok' })
  status: string;

  @ApiProperty({
    description: '마지막 실행 시각(ISO 문자열). 미실행 시 null',
    type: String,
    nullable: true,
    example: '2026-01-24T12:34:56.000Z',
  })
  lastRunAt: Date | null;

  @ApiProperty({
    description: '마지막 실행 성공 여부. 미실행 시 null',
    nullable: true,
    example: true,
  })
  lastSuccess: boolean | null;

  @ApiProperty({ description: '마지막 처리 건수', example: 999 })
  lastProcessedCount: number;

  @ApiProperty({
    description: '마지막 실행 소요 시간(ms). 미실행 시 null',
    nullable: true,
    example: 12345,
  })
  lastDurationMs: number | null;

  @ApiProperty({
    description: '마지막 에러 메시지. 에러가 없으면 null',
    nullable: true,
    example: null,
  })
  lastErrorMessage: string | null;
}

