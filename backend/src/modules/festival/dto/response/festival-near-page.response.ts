import { ApiProperty } from '@nestjs/swagger';
import { FestivalNearResponse } from './festival-near.response';

export class FestivalNearPageResponse {
  @ApiProperty({ name: 'total_page_num', example: 1 })
  totalPageNum: number;

  @ApiProperty({ name: 'post_responses', type: () => [FestivalNearResponse] })
  postResponses: FestivalNearResponse[];
}

