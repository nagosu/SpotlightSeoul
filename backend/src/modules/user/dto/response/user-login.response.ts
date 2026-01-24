import { ApiProperty } from '@nestjs/swagger';

export class UserLoginResponse {
  @ApiProperty({ name: 'access_token' })
  accessToken: string;
}

