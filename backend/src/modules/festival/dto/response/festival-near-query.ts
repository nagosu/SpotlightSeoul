import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { FestivalListStatus } from './festival-list-query';

export class FestivalNearQuery {
  @ApiProperty({ description: '현재 위도', example: 37.5665 })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: '현재 경도', example: 126.978 })
  @IsNumber()
  lot: number;

  @ApiPropertyOptional({ name: 'radius_km', description: '반경(km)', default: 5, example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  radiusKm?: number = 5;

  @ApiPropertyOptional({
    description: '상태 필터',
    enum: ['all', 'upcoming', 'ongoing', 'ended'],
    default: 'all',
  })
  @IsOptional()
  @IsString()
  @IsIn(['all', 'upcoming', 'ongoing', 'ended'])
  status?: FestivalListStatus = 'all';

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ description: '페이지 크기 (최대 100)', default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number = 20;
}

