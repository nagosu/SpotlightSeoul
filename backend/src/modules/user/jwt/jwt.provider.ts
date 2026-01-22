import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { UserTokenInfo } from './user-token-info.type';

function parseBearer(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // 기본: Bearer <token>
  if (trimmed.toLowerCase().startsWith('bearer ')) {
    const token = trimmed.slice(7).trim();
    return token || null;
  }

  // Spring 혼선 고려: raw token도 허용
  return trimmed;
}

@Injectable()
export class JwtProvider {
  constructor(private readonly config: ConfigService) {}

  private get secret(): string {
    const secret = this.config.get<string>('JWT_SECRET');
    if (!secret) throw new Error('JWT_SECRET is required');
    return secret;
  }

  private get accessExpiresMinutes(): number {
    return Number(this.config.get<string>('JWT_ACCESS_EXPIRES_MINUTES', '30'));
  }

  private get refreshExpiresDays(): number {
    return Number(this.config.get<string>('JWT_REFRESH_EXPIRES_DAYS', '30'));
  }

  issueAccessToken(claims: UserTokenInfo): string {
    return jwt.sign(claims, this.secret, {
      expiresIn: `${this.accessExpiresMinutes}m`,
    });
  }

  issueRefreshToken(claims: UserTokenInfo): string {
    return jwt.sign(claims, this.secret, {
      expiresIn: `${this.refreshExpiresDays}d`,
    });
  }

  validateToken(rawTokenOrBearer: string | undefined | null): boolean {
    const token = parseBearer(rawTokenOrBearer);
    if (!token) return false;
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch {
      return false;
    }
  }

  getTokenInfoOrThrow(rawTokenOrBearer: string | undefined | null): UserTokenInfo {
    const token = parseBearer(rawTokenOrBearer);
    if (!token) throw new UnauthorizedException('권한 없음');

    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload | UserTokenInfo;
      const id = (decoded as any)?.id;
      const email = (decoded as any)?.email;
      if (!id || !email) throw new UnauthorizedException('권한 없음');
      return { id: String(id), email: String(email) };
    } catch {
      throw new UnauthorizedException('권한 없음');
    }
  }
}

