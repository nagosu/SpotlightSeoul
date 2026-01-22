import { ApiProperty } from '@nestjs/swagger';

export class FestivalResponse {
  @ApiProperty()
  id: string;

  @ApiProperty({ nullable: true })
  title: string | null;
  @ApiProperty({ nullable: true })
  content: string | null;
  @ApiProperty({ nullable: true })
  address: string | null;
  @ApiProperty({ nullable: true })
  place: string | null;
  @ApiProperty({ nullable: true })
  phone: string | null;

  @ApiProperty({ name: 'main_img', nullable: true })
  mainImg: string | null;
  @ApiProperty({ name: 'thumb_img', nullable: true })
  thumbImg: string | null;

  @ApiProperty({ name: 'festival_view' })
  festivalView: number;
  @ApiProperty({ name: 'festival_like' })
  festivalLike: number;

  @ApiProperty({ name: 'strt_date', nullable: true, type: String })
  strtDate: Date | null;
  @ApiProperty({ name: 'end_date', nullable: true, type: String })
  endDate: Date | null;

  @ApiProperty({ nullable: true })
  lat: number | null;
  @ApiProperty({ nullable: true })
  lot: number | null;

  @ApiProperty({ name: 'org_link', nullable: true })
  orgLink: string | null;

  // Spring 응답 1:1을 위해 포함
  @ApiProperty({ name: 'is_free', nullable: true })
  isFree: string | null;
  @ApiProperty({ name: 'major_code_name', nullable: true })
  majorCodeName: string | null;
  @ApiProperty({ name: 'gu_name', nullable: true })
  guName: string | null;
  @ApiProperty({ name: 'sub_code_name', nullable: true })
  subCodeName: string | null;
}

