import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequest {
  @ApiProperty({ description: '이메일', example: 'jinwoo@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'P@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

