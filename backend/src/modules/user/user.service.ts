import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserCreateRequest } from './dto/request/user-create.request';
import { UserLoginRequest } from './dto/request/user-login.request';
import { UserUpdateRequest } from './dto/request/user-update.request';
import { UserResponse } from './dto/response/user.response';
import { UserMapper } from './user.mapper';
import { JwtProvider } from './jwt/jwt.provider';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async create(body: UserCreateRequest): Promise<UserResponse> {
    const user = this.userRepository.save({
      username: body.username,
      email: body.email,
      password: body.password, // TODO: 운영에서는 해싱 전환 필요
      location: body.location,
      isDeleted: false,
      refreshToken: null,
    } as any);

    return this.userMapper.toResponse(await user);
  }

  /**
   * 로그인: access(30m) 발급
   * refresh(30d)는 DB에 저장하되 응답에는 내려주지 않음
   */
  async login(body: UserLoginRequest): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmailAndPasswordActive(
      body.email,
      body.password,
    );
    if (!user) throw new BadRequestException('사용자가 없습니다.');

    // refreshToken 재사용 로직
    if (user.refreshToken && this.jwtProvider.validateToken(user.refreshToken)) {
      const claims = this.jwtProvider.getTokenInfoOrThrow(user.refreshToken);
      const accessToken = this.jwtProvider.issueAccessToken(claims);
      return { accessToken };
    }

    const claims = { id: user.id, email: user.email };
    const accessToken = this.jwtProvider.issueAccessToken(claims);
    const refreshToken = this.jwtProvider.issueRefreshToken(claims);

    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return { accessToken };
  }

  async getById(userId: string): Promise<UserResponse> {
    // Spring 1:1: token의 id와 userId 일치 검증을 "하지 않는다"
    const user = await this.userRepository.findByIdOrFail(userId);
    return this.userMapper.toResponse(user);
  }

  async update(body: UserUpdateRequest): Promise<UserResponse> {
    // 인증 요구 없음(원본 1:1에 가깝게)
    const user = await this.userRepository.findByIdOrFail(body.id);
    user.username = body.username;
    user.password = body.password; // TODO: 운영에서는 해싱 전환 필요
    user.email = body.email;
    user.location = body.location;
    return this.userMapper.toResponse(await this.userRepository.save(user));
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.softDeleteById(id);
  }
}

