import { ApiProperty } from '@nestjs/swagger';

export class FestivalDetailResponse {
  @ApiProperty({ description: '축제 ID', example: '1' })
  id: string;

  @ApiProperty({ description: '타이틀', nullable: true, example: '서울광장 겨울 축제' })
  title: string | null;
  @ApiProperty({ description: '내용', nullable: true, example: '서울광장에서 진행되는 겨울 문화 행사입니다.' })
  content: string | null;
  @ApiProperty({ description: '주소', nullable: true, example: '서울특별시 중구 세종대로 110' })
  address: string | null;
  @ApiProperty({ description: '장소', nullable: true, example: '서울광장' })
  place: string | null;
  @ApiProperty({ description: '문의 전화', nullable: true, example: '02-123-4567' })
  phone: string | null;

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

  @ApiProperty({ name: 'festival_view', description: '조회수', example: 123 })
  festivalView: number;
  @ApiProperty({ name: 'festival_like', description: '좋아요 수', example: 45 })
  festivalLike: number;
  @ApiProperty({
    description: '현재 로그인 사용자의 좋아요 여부(비로그인/식별불가 시 null)',
    nullable: true,
    example: true,
  })
  liked: boolean | null;
  @ApiProperty({
    description: '현재 로그인 사용자의 북마크 여부(비로그인/식별불가 시 null)',
    nullable: true,
    example: false,
  })
  bookmarked: boolean | null;

  @ApiProperty({
    name: 'strt_date',
    description: '시작일(ISO 문자열)',
    nullable: true,
    type: String,
    example: '2026-02-01T00:00:00.000Z',
  })
  strtDate: Date | null;
  @ApiProperty({
    name: 'end_date',
    description: '종료일(ISO 문자열)',
    nullable: true,
    type: String,
    example: '2026-02-28T00:00:00.000Z',
  })
  endDate: Date | null;

  @ApiProperty({ description: '위도', nullable: true, example: 37.5665 })
  lat: number | null;
  @ApiProperty({ description: '경도', nullable: true, example: 126.978 })
  lot: number | null;

  @ApiProperty({
    name: 'org_link',
    description: '주관/상세 링크',
    nullable: true,
    example: 'https://example.com/festivals/1',
  })
  orgLink: string | null;

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

