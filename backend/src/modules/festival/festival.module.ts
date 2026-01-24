import { Module } from '@nestjs/common';
import { FestivalRepository } from './repository/festival.repository';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';
import { FestivalMapper } from './festival.mapper';
import { UserModule } from '../user/user.module';
import { UserBookmarkController } from './user-bookmark.controller';

@Module({
  imports: [UserModule],
  controllers: [FestivalController, UserBookmarkController],
  providers: [FestivalRepository, FestivalService, FestivalMapper],
  exports: [FestivalRepository, FestivalMapper],
})
export class FestivalModule {}

