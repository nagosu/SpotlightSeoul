import { ApiProperty } from '@nestjs/swagger';
import { FestivalResponse } from './festival-response';

export class FestivalPageResponse {
  @ApiProperty({ name: 'total_page_num', example: 1 })
  totalPageNum: number;

  @ApiProperty({ name: 'post_responses', type: () => [FestivalResponse] })
  postResponses: FestivalResponse[];
}

