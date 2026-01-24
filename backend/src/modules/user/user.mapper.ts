import { User } from './entity/user.entity';
import { UserResponse } from './dto/response/user.response';

export class UserMapper {
  toResponse(entity: User): UserResponse {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      location: entity.location,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt ?? null,
    };
  }
}

