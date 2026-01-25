import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({ description: '회원 ID', example: '1' })
  id: string;

  @ApiProperty({ description: '닉네임', example: 'jinwoo' })
  username: string;

  @ApiProperty({ description: '이메일', example: 'jinwoo@example.com' })
  email: string;

  @ApiProperty({ description: '거주 지역/선호 지역', example: '서울특별시 중구' })
  location: string;

  @ApiProperty({
    name: 'created_at',
    description: '생성 시각(ISO 문자열)',
    type: String,
    example: '2026-01-24T12:34:56.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    name: 'updated_at',
    description: '수정 시각(ISO 문자열)',
    type: String,
    example: '2026-01-24T12:34:56.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    name: 'deleted_at',
    description: '삭제 시각(소프트삭제, ISO 문자열). 미삭제 시 null',
    type: String,
    nullable: true,
    example: null,
  })
  deletedAt: Date | null;

  // Spring 원본은 엔티티 반환이라 password 노출 가능성이 있음.
  // TODO: 1:1 목표를 최대한 유지하되 보안상 password는 응답에서 제외한다.
}

