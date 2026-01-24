import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateRequest } from './dto/request/user-create.request';
import { UserLoginRequest } from './dto/request/user-login.request';
import { UserUpdateRequest } from './dto/request/user-update.request';
import { UserResponse } from './dto/response/user.response';
import { UserLoginResponse } from './dto/response/user-login.response';
import { JwtAuthorizationGuard } from './jwt/jwt-authorization.guard';

@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 회원가입: POST /api/v1/users
  @ApiOperation({ summary: '회원가입' })
  @ApiBody({
    type: UserCreateRequest,
    examples: {
      basic: {
        summary: '기본 회원가입',
        value: {
          username: 'jinwoo',
          password: 'P@ssw0rd!',
          email: 'jinwoo@example.com',
          location: '서울특별시 중구',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UserResponse })
  @Post('users')
  create(@Body() body: UserCreateRequest): Promise<UserResponse> {
    return this.userService.create(body);
  }

  // 로그인: POST /api/v1/login
  @ApiOperation({ summary: '로그인(AccessToken 발급)' })
  @ApiBody({
    type: UserLoginRequest,
    examples: {
      basic: {
        summary: '이메일/비밀번호 로그인',
        value: {
          email: 'jinwoo@example.com',
          password: 'P@ssw0rd!',
        },
      },
    },
  })
  @ApiCreatedResponse({ type: UserLoginResponse })
  @Post('login')
  login(@Body() body: UserLoginRequest): Promise<UserLoginResponse> {
    // snake_case interceptor로 access_token으로 내려감
    return this.userService.login(body);
  }

  // 회원조회: GET /api/v1/users/:userId (인증 요구, Spring처럼 id 일치 검증 X)
  @ApiOperation({ summary: '회원조회' })
  @ApiOkResponse({ type: UserResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationGuard)
  @Get('users/:userId')
  getById(@Param('userId') userId: string): Promise<UserResponse> {
    return this.userService.getById(userId);
  }

  // 회원수정: PUT /api/v1/users (인증 요구 없음)
  @ApiOperation({ summary: '회원수정' })
  @ApiBody({
    type: UserUpdateRequest,
    examples: {
      basic: {
        summary: '기본 회원정보 수정',
        value: {
          id: '1',
          username: 'jinwoo',
          password: 'P@ssw0rd!',
          email: 'jinwoo@example.com',
          location: '서울특별시 중구',
        },
      },
    },
  })
  @ApiOkResponse({ type: UserResponse })
  @Put('users')
  update(@Body() body: UserUpdateRequest): Promise<UserResponse> {
    return this.userService.update(body);
  }

  // 회원삭제(소프트삭제): DELETE /api/v1/users/:id -> 204
  @ApiOperation({ summary: '회원삭제(소프트삭제)' })
  @HttpCode(204)
  @Delete('users/:id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
