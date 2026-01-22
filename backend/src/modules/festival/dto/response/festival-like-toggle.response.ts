import { ApiProperty } from '@nestjs/swagger';

export class FestivalLikeToggleResponse {
  @ApiProperty({ name: 'festival_like' })
  festivalLike: number;

  @ApiProperty({ example: true })
  liked: boolean;
}

