import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  location: string;

  @ApiProperty({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;

  // Spring 원본은 엔티티 반환이라 password 노출 가능성이 있음.
  // TODO: 1:1 목표를 최대한 유지하되 보안상 password는 응답에서 제외한다.
}

