import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FestivalFilterQuery {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  place?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 is_free 컬럼이 없음.
   * - 입력은 받되(filter DTO 유지), repository에서는 무시한다.
   */
  @IsOptional()
  isFree?: boolean;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 major_code_name 컬럼이 없음.
   */
  @IsOptional()
  @IsString()
  majorCodeName?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 gu_name 컬럼이 없음.
   */
  @IsOptional()
  @IsString()
  guName?: string;

  /**
   * TODO: Spring 1:1 필터지만 현재 DB에 sub_code_name 컬럼이 없음.
   */
  @IsOptional()
  @IsString()
  subCodeName?: string;

  // 요청일 기준(YYYY-MM-DD)로 받고, repository에서 00:00:00 / 23:59:59 경계로 변환
  @IsOptional()
  @IsString()
  strtDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number = 20;
}

