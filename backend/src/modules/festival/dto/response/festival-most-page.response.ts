import { ApiProperty } from '@nestjs/swagger';
import { FestivalMostResponse } from './festival-most.response';

export class FestivalMostPageResponse {
  @ApiProperty({ name: 'total_page_num', description: '전체 페이지 수', example: 1 })
  totalPageNum: number;

  @ApiProperty({
    name: 'post_responses',
    description: '정렬 결과 리스트',
    type: () => [FestivalMostResponse],
  })
  postResponses: FestivalMostResponse[];
}

