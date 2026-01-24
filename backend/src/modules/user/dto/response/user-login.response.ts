import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponse {
  @ApiProperty({
    name: 'access_token',
    description: 'Bearer 인증용 Access Token(JWT)',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6Imppbndvb0BleGFtcGxlLmNvbSIsImlhdCI6MTcwNjA5MTk2Nn0.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  })
  accessToken: string;
}

