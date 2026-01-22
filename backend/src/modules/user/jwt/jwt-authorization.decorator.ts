import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { UserTokenInfo } from './user-token-info.type';

export const JwtAuthorization = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserTokenInfo | undefined => {
    const req = ctx.switchToHttp().getRequest<Request & { userTokenInfo?: UserTokenInfo }>();
    return req.userTokenInfo;
  },
);

