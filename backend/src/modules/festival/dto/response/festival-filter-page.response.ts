import { ApiProperty } from '@nestjs/swagger';
import { FestivalFilterResponse } from './festival-filter.response';

export class FestivalFilterPageResponse {
  @ApiProperty({ name: 'total_page_num', description: '전체 페이지 수', example: 1 })
  totalPageNum: number;

  @ApiProperty({
    name: 'post_responses',
    description: '필터 결과 리스트',
    type: () => [FestivalFilterResponse],
  })
  postResponses: FestivalFilterResponse[];
}

