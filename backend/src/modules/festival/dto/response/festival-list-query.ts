import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FestivalFilterQuery } from './festival-filter-query';

export type FestivalListStatus = 'all' | 'upcoming' | 'ongoing' | 'ended';
export type FestivalListSort = 'recent' | 'like' | 'view' | 'end_date';

export class FestivalListQuery extends FestivalFilterQuery {
  @ApiPropertyOptional({
    description: '상태 필터',
    enum: ['all', 'upcoming', 'ongoing', 'ended'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  @IsIn(['all', 'upcoming', 'ongoing', 'ended'])
  status?: FestivalListStatus = 'all';

  @ApiPropertyOptional({
    description: '정렬 기준',
    enum: ['recent', 'like', 'view', 'end_date'],
    default: 'recent',
  })
  @IsOptional()
  @IsString()
  @IsIn(['recent', 'like', 'view', 'end_date'])
  sort?: FestivalListSort = 'recent';

  // `FestivalFilterQuery`의 page/size 기본값을 유지하되, Swagger에서 의도를 명확히 보여주기 위해 재정의
  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  size?: number = 20;
}

