import { ApiProperty } from '@nestjs/swagger';

export class FestivalLikeResponse {
  @ApiProperty({ name: 'festival_like', description: '좋아요 수', example: 46 })
  festivalLike: number;
}

