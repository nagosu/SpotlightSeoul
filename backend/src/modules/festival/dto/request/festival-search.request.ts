import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FestivalSearchRequest {
  @ApiProperty({ description: '검색할 타이틀(부분 일치, REPLACE 포함)', example: '서울' })
  @IsString()
  @IsNotEmpty()
  title: string;
}

