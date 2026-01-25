import { ApiProperty } from '@nestjs/swagger';
import { FestivalSearchResponse } from './festival-search.response';

export class FestivalSearchPageResponse {
  @ApiProperty({ name: 'total_page_num', description: '전체 페이지 수', example: 1 })
  totalPageNum: number;

  @ApiProperty({
    name: 'post_responses',
    description: '검색 결과 리스트',
    type: () => [FestivalSearchResponse],
  })
  postResponses: FestivalSearchResponse[];
}

