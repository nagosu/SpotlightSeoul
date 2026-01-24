import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthorizationGuard } from '../user/jwt/jwt-authorization.guard';
import { JwtAuthorization } from '../user/jwt/jwt-authorization.decorator';
import { UserTokenInfo } from '../user/jwt/user-token-info.type';
import { FestivalService } from './festival.service';
import { FestivalPageResponse } from './dto/response/festival-page.response';

@ApiTags('User')
@Controller('users/me')
export class UserBookmarkController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiOperation({ summary: '내 북마크(찜) 목록' })
  @ApiOkResponse({ type: FestivalPageResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationGuard)
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @Get('bookmarks')
  getMyBookmarks(
    @JwtAuthorization() userTokenInfo: UserTokenInfo | undefined,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
  ): Promise<FestivalPageResponse> {
    const userId = userTokenInfo?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.festivalService.listBookmarks(userId, page, size);
  }
}

