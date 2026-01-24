import { ApiProperty } from '@nestjs/swagger';

export class FestivalBookmarkToggleResponse {
  @ApiProperty({ example: true })
  bookmarked: boolean;
}

