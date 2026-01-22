import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { JwtProvider } from './jwt.provider';

@Injectable()
export class JwtAuthorizationGuard implements CanActivate {
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
      const userTokenInfo = this.jwtProvider.getTokenInfoOrThrow(token);
      req.userTokenInfo = userTokenInfo;
      return true;
    } catch {
      throw new UnauthorizedException('권한 없음');
    }
  }
}

