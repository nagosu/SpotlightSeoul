import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FestivalService } from './festival.service';
import { FestivalPageResponse } from './dto/response/festival-page.response';
import { FestivalDetailResponse } from './dto/response/festival-detail.response';
import { FestivalSearchRequest } from './dto/request/festival-search.request';
import { FestivalSearchPageResponse } from './dto/response/festival-search-page.response';
import { FestivalFilterQuery } from './dto/response/festival-filter-query';
import { FestivalFilterPageResponse } from './dto/response/festival-filter-page.response';
import { FestivalLikeResponse } from './dto/response/festival-like.response';
import { FestivalLikeToggleResponse } from './dto/response/festival-like-toggle.response';
import { FestivalBookmarkToggleResponse } from './dto/response/festival-bookmark-toggle.response';
import { FestivalMostPageResponse } from './dto/response/festival-most-page.response';
import { FestivalListQuery } from './dto/response/festival-list-query';
import { FestivalNearQuery } from './dto/response/festival-near-query';
import { FestivalNearPageResponse } from './dto/response/festival-near-page.response';
import { FestivalSuggestQuery } from './dto/response/festival-suggest-query';
import { FestivalSuggestResponse } from './dto/response/festival-suggest.response';
import { JwtAuthorizationGuard } from '../user/jwt/jwt-authorization.guard';
import { JwtAuthorization } from '../user/jwt/jwt-authorization.decorator';
import { UserTokenInfo } from '../user/jwt/user-token-info.type';

@ApiTags('Festival')
@Controller('festivals')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @ApiOperation({ summary: '좋아요 토글(추가/취소)' })
  @ApiOkResponse({ type: FestivalLikeToggleResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationGuard)
  @Put(':id/like')
  toggleLike(
    @Param('id') id: string,
    @JwtAuthorization() userTokenInfo: UserTokenInfo | undefined,
  ): Promise<FestivalLikeToggleResponse> {
    const userId = userTokenInfo?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.festivalService.toggleLike(userId, id);
  }

  @ApiOperation({ summary: '북마크(찜) 토글(추가/취소)' })
  @ApiOkResponse({ type: FestivalBookmarkToggleResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationGuard)
  @Put(':id/bookmark')
  toggleBookmark(
    @Param('id') id: string,
    @JwtAuthorization() userTokenInfo: UserTokenInfo | undefined,
  ): Promise<FestivalBookmarkToggleResponse> {
    const userId = userTokenInfo?.id;
    if (!userId) throw new UnauthorizedException('Unauthorized');
    return this.festivalService.toggleBookmark(userId, id);
  }

  @ApiOperation({ summary: '내 주변 축제(거리순)' })
  @ApiOkResponse({ type: FestivalNearPageResponse })
  @Get('near')
  near(@Query() query: FestivalNearQuery): Promise<FestivalNearPageResponse> {
    return this.festivalService.near(query);
  }

  @ApiOperation({ summary: '검색 자동완성(타이틀)' })
  @ApiOkResponse({ type: FestivalSuggestResponse })
  @Get('suggest')
  suggest(@Query() query: FestivalSuggestQuery): Promise<FestivalSuggestResponse> {
    return this.festivalService.suggest(query);
  }

  /**
   * 사용자 기능: 기간/상태/정렬 통합 리스트
   * - 기존 endpoint(/page, /category, /likes, /views)는 그대로 유지
   */
  @ApiOperation({ summary: '통합 리스트(기간/상태/정렬/페이징)' })
  @ApiOkResponse({ type: FestivalPageResponse })
  @Get()
  list(@Query() query: FestivalListQuery): Promise<FestivalPageResponse> {
    return this.festivalService.list(query);
  }

  // 1) GET /festivals/page?offset=0&size=10 (offset은 "페이지 번호")
  @ApiOperation({ summary: '페이징 목록 조회(offset=페이지 번호)' })
  @ApiQuery({ name: 'offset', required: true, example: 0 })
  @ApiQuery({ name: 'size', required: true, example: 10 })
  @ApiOkResponse({ type: FestivalPageResponse })
  @Get('page')
  getPage(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
  ): Promise<FestivalPageResponse> {
    return this.festivalService.getPage(offset, size);
  }

  // 4) GET /festivals/category (QueryString 필터 + pageable)
  @ApiOperation({ summary: '필터 검색' })
  @ApiOkResponse({ type: FestivalFilterPageResponse })
  @Get('category')
  getByCategory(@Query() query: FestivalFilterQuery): Promise<FestivalFilterPageResponse> {
    return this.festivalService.filter(query);
  }

  // 6) GET /festivals/likes?likes= (festival_like desc)
  @ApiOperation({ summary: '좋아요 많은 순' })
  @ApiQuery({ name: 'likes', required: false })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiOkResponse({ type: FestivalMostPageResponse })
  @Get('likes')
  mostLike(
    @Query('likes') likes?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size?: number,
  ): Promise<FestivalMostPageResponse> {
    const likesNum = likes !== undefined ? Number(likes) : undefined;
    return this.festivalService.mostLike(
      Number.isFinite(likesNum) ? likesNum : undefined,
      page ?? 0,
      size ?? 20,
    );
  }

  // 7) GET /festivals/views?views= (버그 복제: 조건은 festival_like > views, 정렬은 festival_view desc)
  @ApiOperation({ summary: '조회수 많은 순(버그 복제: 조건은 festival_like > views)' })
  @ApiQuery({ name: 'views', required: false })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiOkResponse({ type: FestivalMostPageResponse })
  @Get('views')
  mostView(
    @Query('views') views?: string,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size?: number,
  ): Promise<FestivalMostPageResponse> {
    const viewsNum = views !== undefined ? Number(views) : undefined;
    return this.festivalService.mostView(
      Number.isFinite(viewsNum) ? viewsNum : undefined,
      page ?? 0,
      size ?? 20,
    );
  }

  // 5) PUT /festivals/likes/:id (좋아요 +1, 트랜잭션)
  @ApiOperation({ summary: '좋아요 +1' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiOkResponse({ type: FestivalLikeResponse })
  @Put('likes/:id')
  like(@Param('id') id: string): Promise<FestivalLikeResponse> {
    return this.festivalService.like(id);
  }

  // 2) GET /festivals/:id (상세 + 조회수 +1, 트랜잭션)
  @ApiOperation({ summary: '상세 조회(조회수 +1)' })
  @ApiParam({ name: 'id', example: '1' })
  @ApiOkResponse({ type: FestivalDetailResponse })
  @Get(':id')
  getDetail(@Param('id') id: string): Promise<FestivalDetailResponse> {
    return this.festivalService.getDetail(id);
  }

  // 3) POST /festivals (검색, REPLACE 포함)
  @ApiOperation({ summary: '타이틀 검색(REPLACE 포함)' })
  @ApiBody({
    type: FestivalSearchRequest,
    examples: {
      basic: {
        summary: '타이틀 검색',
        value: {
          title: '서울',
        },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, example: 0 })
  @ApiQuery({ name: 'size', required: false, example: 20 })
  @ApiCreatedResponse({ type: FestivalSearchPageResponse })
  @Post()
  search(
    @Body() body: FestivalSearchRequest,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(20), ParseIntPipe) size: number,
  ): Promise<FestivalSearchPageResponse> {
    return this.festivalService.search(body, page, size);
  }
}

