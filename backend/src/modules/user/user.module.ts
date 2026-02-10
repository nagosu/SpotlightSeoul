import { Module } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserMapper } from './user.mapper';
import { JwtProvider } from './jwt/jwt.provider';
import { JwtAuthorizationGuard } from './jwt/jwt-authorization.guard';
import { OptionalJwtAuthorizationGuard } from './jwt/optional-jwt-authorization.guard';

@Module({
  controllers: [UserController],
  providers: [
    UserRepository,
    UserService,
    UserMapper,
    JwtProvider,
    JwtAuthorizationGuard,
    OptionalJwtAuthorizationGuard,
  ],
  exports: [UserRepository, JwtProvider, JwtAuthorizationGuard, OptionalJwtAuthorizationGuard],
})
export class UserModule {}

