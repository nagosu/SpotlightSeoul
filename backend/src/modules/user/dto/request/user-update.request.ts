import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserUpdateRequest {
  @ApiProperty({ description: '회원 ID', example: '1' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: '닉네임', example: 'jinwoo' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '비밀번호', example: 'P@ssw0rd!' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: '이메일', example: 'jinwoo@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '거주 지역/선호 지역', example: '서울특별시 중구' })
  @IsString()
  @IsNotEmpty()
  location: string;
}

