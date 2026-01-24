import { ApiProperty } from '@nestjs/swagger';

export class FestivalMostResponse {
  @ApiProperty({ description: '축제 ID', example: '1' })
  id: string;
  @ApiProperty({ description: '타이틀', nullable: true, example: '서울광장 겨울 축제' })
  title: string | null;
  @ApiProperty({ description: '장소', nullable: true, example: '서울광장' })
  place: string | null;

  @ApiProperty({ name: 'festival_view', description: '조회수', example: 123 })
  festivalView: number;
  @ApiProperty({ name: 'festival_like', description: '좋아요 수', example: 45 })
  festivalLike: number;

  @ApiProperty({
    name: 'main_img',
    description: '대표 이미지 URL',
    nullable: true,
    example: 'https://example.com/images/festival-main.jpg',
  })
  mainImg: string | null;
  @ApiProperty({
    name: 'thumb_img',
    description: '썸네일 이미지 URL',
    nullable: true,
    example: 'https://example.com/images/festival-thumb.jpg',
  })
  thumbImg: string | null;

  // Spring 응답 1:1을 위해 포함
  @ApiProperty({
    name: 'is_free',
    description: '무료 여부(원본 데이터 문자열)',
    nullable: true,
    example: '무료',
  })
  isFree: string | null;
  @ApiProperty({ name: 'major_code_name', description: '대분류', nullable: true, example: '문화' })
  majorCodeName: string | null;
  @ApiProperty({ name: 'gu_name', description: '구', nullable: true, example: '중구' })
  guName: string | null;
  @ApiProperty({ name: 'sub_code_name', description: '소분류', nullable: true, example: '축제' })
  subCodeName: string | null;
}

