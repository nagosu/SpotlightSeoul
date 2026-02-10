import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FestivalRepository } from './repository/festival.repository';
import { FestivalMapper } from './festival.mapper';
import { FestivalPageResponse } from './dto/response/festival-page.response';
import { FestivalDetailResponse } from './dto/response/festival-detail.response';
import { FestivalSearchPageResponse } from './dto/response/festival-search-page.response';
import { FestivalFilterPageResponse } from './dto/response/festival-filter-page.response';
import { FestivalLikeResponse } from './dto/response/festival-like.response';
import { FestivalMostPageResponse } from './dto/response/festival-most-page.response';
import { FestivalSearchRequest } from './dto/request/festival-search.request';
import { FestivalFilterQuery } from './dto/response/festival-filter-query';
import { FestivalListQuery } from './dto/response/festival-list-query';
import { FestivalNearQuery } from './dto/response/festival-near-query';
import { FestivalNearPageResponse } from './dto/response/festival-near-page.response';
import { FestivalSuggestQuery } from './dto/response/festival-suggest-query';
import { FestivalSuggestResponse } from './dto/response/festival-suggest.response';
import { FestivalLikeToggleResponse } from './dto/response/festival-like-toggle.response';
import { FestivalBookmarkToggleResponse } from './dto/response/festival-bookmark-toggle.response';

@Injectable()
export class FestivalService {
  private readonly logger = new Logger(FestivalService.name);

  constructor(
    private readonly festivalRepository: FestivalRepository,
    private readonly festivalMapper: FestivalMapper,
    private readonly config: ConfigService,
  ) {}

  private get counterUpdateMode(): 'entity' | 'atomic' {
    const raw = (this.config.get<string>('FESTIVAL_COUNTER_UPDATE_MODE', 'entity') || 'entity').toLowerCase();
    return raw === 'atomic' ? 'atomic' : 'entity';
  }

  private get coordsSwapMode(): 'legacy' | 'fixed' {
    const raw = (this.config.get<string>('FESTIVAL_COORDS_SWAP_MODE', 'legacy') || 'legacy').toLowerCase();
    return raw === 'fixed' ? 'fixed' : 'legacy';
  }

  async getPage(offset: number, size: number): Promise<FestivalPageResponse> {
    const { totalPageNum, postResponses } =
      await this.festivalRepository.findPage(offset, size);
    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toResponse(e)),
    };
  }

  async getDetail(id: string, userId?: string): Promise<FestivalDetailResponse> {
    // 상세 조회 시 조회수 +1
    if (this.counterUpdateMode === 'atomic') {
      await this.festivalRepository.increaseViewAtomic(id);
    } else {
      await this.festivalRepository.increaseView(id);
    }
    const festival = await this.festivalRepository.findByIdOrFail(id);

    let liked: boolean | null = null;
    let bookmarked: boolean | null = null;

    if (userId) {
      [liked, bookmarked] = await Promise.all([
        this.festivalRepository.isLikedBy(userId, id),
        this.festivalRepository.isBookmarkedBy(userId, id),
      ]);
    }

    return this.festivalMapper.toDetailResponse(festival, { liked, bookmarked });
  }

  async search(
    body: FestivalSearchRequest,
    page: number,
    size: number,
  ): Promise<FestivalSearchPageResponse> {
    const { totalPageNum, postResponses } =
      await this.festivalRepository.searchByTitle(body.title, page, size);

    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toSearchResponse(e)),
    };
  }

  async filter(query: FestivalFilterQuery): Promise<FestivalFilterPageResponse> {
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    const { totalPageNum, postResponses } = await this.festivalRepository.filter(
      query,
      page,
      size,
    );

    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toFilterResponse(e)),
    };
  }

  /**
   * 사용자 기능: 기간/상태/정렬 통합 리스트
   * - 기존 endpoint는 유지하고, 신규 GET /festivals 에서만 사용
   */
  async list(query: FestivalListQuery): Promise<FestivalPageResponse> {
    const page = query.page ?? 0;
    const size = query.size ?? 20;

    const { totalPageNum, postResponses } = await this.festivalRepository.list(query, page, size);

    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toResponse(e)),
    };
  }

  async near(query: FestivalNearQuery): Promise<FestivalNearPageResponse> {
    const page = query.page ?? 0;
    const size = query.size ?? 20;
    const radiusKm = query.radiusKm ?? 5;
    const status = (query.status ?? 'all').toLowerCase() as any;

    const { totalPageNum, postResponses, distancesKm } = await this.festivalRepository.near(
      query.lat,
      query.lot,
      radiusKm,
      page,
      size,
      this.coordsSwapMode,
      status,
    );

    return {
      totalPageNum,
      postResponses: postResponses.map((e, i) => this.festivalMapper.toNearResponse(e, distancesKm[i])),
    };
  }

  async suggest(query: FestivalSuggestQuery): Promise<FestivalSuggestResponse> {
    const q = (query.q ?? '').trim();
    if (!q) throw new BadRequestException('q는 필수입니다.');

    const suggestions = await this.festivalRepository.suggestTitles(query);
    return { suggestions };
  }

  async like(id: string): Promise<FestivalLikeResponse> {
    const festivalLike =
      this.counterUpdateMode === 'atomic'
        ? await this.festivalRepository.increaseLikeAtomic(id)
        : await this.festivalRepository.increaseLike(id);

    this.logger.log(`FESTIVAL_COUNTER_UPDATE_MODE=${this.counterUpdateMode}`);
    return { festivalLike };
  }

  async toggleLike(userId: string, festivalId: string): Promise<FestivalLikeToggleResponse> {
    const { festivalLike, liked } = await this.festivalRepository.toggleLike(userId, festivalId);
    return { festivalLike, liked };
  }

  async toggleBookmark(userId: string, festivalId: string): Promise<FestivalBookmarkToggleResponse> {
    return this.festivalRepository.toggleBookmark(userId, festivalId);
  }

  async listBookmarks(userId: string, page: number, size: number): Promise<FestivalPageResponse> {
    const { totalPageNum, postResponses } = await this.festivalRepository.findBookmarks(userId, page, size);
    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toResponse(e)),
    };
  }

  async mostLike(
    likes: number | undefined,
    page: number,
    size: number,
  ): Promise<FestivalMostPageResponse> {
    const { totalPageNum, postResponses } = await this.festivalRepository.mostLike(
      likes,
      page,
      size,
    );

    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toMostResponse(e)),
    };
  }

  async mostView(
    views: number | undefined,
    page: number,
    size: number,
  ): Promise<FestivalMostPageResponse> {
    const { totalPageNum, postResponses } = await this.festivalRepository.mostView(
      views,
      page,
      size,
    );

    return {
      totalPageNum,
      postResponses: postResponses.map((e) => this.festivalMapper.toMostResponse(e)),
    };
  }
}

