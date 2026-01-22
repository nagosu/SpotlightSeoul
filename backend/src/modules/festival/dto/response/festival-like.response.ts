import { ApiProperty } from '@nestjs/swagger';

export class FestivalLikeResponse {
  @ApiProperty({ name: 'festival_like' })
  festivalLike: number;
}

