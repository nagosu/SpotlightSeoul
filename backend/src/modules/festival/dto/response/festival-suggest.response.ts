import { ApiProperty } from '@nestjs/swagger';

export class FestivalSuggestResponse {
  @ApiProperty({ type: [String], example: ['서울 청년 문화패스', '서울 야외 영화제'] })
  suggestions: string[];
}

