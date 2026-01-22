import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class FestivalSuggestQuery {
  @ApiProperty({ description: '검색어(타이틀 자동완성)', example: '서울' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ description: '최대 개수', default: 10, example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 10;
}

