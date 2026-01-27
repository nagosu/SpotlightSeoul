import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FestivalFilterQuery {
  @ApiPropertyOptional({ description: '타이틀(부분 일치)', example: '서울' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '장소(부분 일치)', example: '서울광장' })
  @IsOptional()
  @IsString()
  place?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 is_free 컬럼이 없음.
   * - 입력은 받되(filter DTO 유지), repository에서는 무시한다.
   */
  @ApiPropertyOptional({ description: '무료 여부(현재는 입력만 받고 필터링은 미적용)', example: true })
  @IsOptional()
  isFree?: boolean;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 major_code_name 컬럼이 없음.
   */
  @ApiPropertyOptional({ description: '대분류(현재는 입력만 받고 필터링은 미적용)', example: '문화' })
  @IsOptional()
  @IsString()
  majorCodeName?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 gu_name 컬럼이 없음.
   */
  @ApiPropertyOptional({ description: '구(현재는 입력만 받고 필터링은 미적용)', example: '중구' })
  @IsOptional()
  @IsString()
  guName?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 sub_code_name 컬럼이 없음.
   */
  @ApiPropertyOptional({ description: '소분류(현재는 입력만 받고 필터링은 미적용)', example: '축제' })
  @IsOptional()
  @IsString()
  subCodeName?: string;

  // 요청일 기준(YYYY-MM-DD)로 받고, repository에서 00:00:00 / 23:59:59 경계로 변환
  @ApiPropertyOptional({ description: '시작일(YYYY-MM-DD)', example: '2026-01-24' })
  @IsOptional()
  @IsString()
  strtDate?: string;

  @ApiPropertyOptional({ description: '종료일(YYYY-MM-DD)', example: '2026-02-01' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ description: '페이지(0부터 시작)', default: 0, example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ description: '페이지 크기 (최대 100)', default: 20, example: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;
}

