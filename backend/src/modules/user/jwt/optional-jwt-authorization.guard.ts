import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtProvider } from './jwt.provider';

@Injectable()
export class OptionalJwtAuthorizationGuard implements CanActivate {
  constructor(
    private readonly jwtProvider: JwtProvider,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { userTokenInfo?: any }>();
    const headerName = this.config.get<string>('AUTH_HEADER', 'Authorization');

    const raw = (req.headers as any)?.[headerName.toLowerCase()];
    const token = Array.isArray(raw) ? raw[0] : raw;

    try {
      req.userTokenInfo = this.jwtProvider.getTokenInfoOrThrow(token);
    } catch {
      // 비로그인 또는 유효하지 않은 토큰은 익명 사용자로 처리
      req.userTokenInfo = undefined;
    }

    return true;
  }
}
