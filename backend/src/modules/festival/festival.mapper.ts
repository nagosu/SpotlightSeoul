import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { Festival } from './entity/festival.entity';
import { FestivalDetailResponse } from './dto/response/festival-detail.response';
import { FestivalFilterResponse } from './dto/response/festival-filter.response';
import { FestivalMostResponse } from './dto/response/festival-most.response';
import { FestivalNearResponse } from './dto/response/festival-near.response';
import { FestivalResponse } from './dto/response/festival-response';
import { FestivalSearchResponse } from './dto/response/festival-search.response';
import { FestivalRow } from '../seoul-open-data/dto/festival-api.response';
import { TimeFormatter } from '../../global/utils/time-formatter';
import { EventCategoryUtil } from '../../global/utils/event-category.util';

function normalizeNumber(raw?: string | null): number | null {
  if (raw === undefined || raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

type CoordsSwapMode = 'legacy' | 'fixed';

function getCoordsSwapMode(config: ConfigService): CoordsSwapMode {
  const raw = (config.get<string>('FESTIVAL_COORDS_SWAP_MODE', 'legacy') || 'legacy').toLowerCase();
  return raw === 'fixed' ? 'fixed' : 'legacy';
}

function buildDedupeKey(input: string): string {
  return createHash('sha1').update(input, 'utf8').digest('hex');
}

@Injectable()
export class FestivalMapper {
  private readonly logger = new Logger(FestivalMapper.name);
  private readonly coordsSwapMode: CoordsSwapMode;

  constructor(private readonly config: ConfigService) {
    this.coordsSwapMode = getCoordsSwapMode(this.config);
    this.logger.log(`FESTIVAL_COORDS_SWAP_MODE=${this.coordsSwapMode}`);
  }

  /**
   * Seoul Open API row -> Festival entity 변환
   * - ENV: FESTIVAL_COORDS_SWAP_MODE
   *   - legacy: Spring 1:1대로 lat=row.LOT, lot=row.LAT
   *   - fixed : 정상 매핑 lat=row.LAT, lot=row.LOT
   */
  fromFestivalRow(row: FestivalRow): Festival {
    const festival = new Festival();

    festival.isEnd = null;
    festival.festivalView = 0;
    festival.festivalLike = 0;

    festival.title = row.TITLE ?? null;
    festival.place = row.PLACE ?? null;
    festival.orgLink = row.ORG_LINK ?? null;
    festival.mainImg = row.MAIN_IMG ?? null;

    festival.strtDate = TimeFormatter.parseDateTime(row.STRTDATE ?? null);
    festival.endDate = TimeFormatter.parseDateTime(row.END_DATE ?? null);

    const lat = normalizeNumber(row.LAT ?? null);
    const lot = normalizeNumber(row.LOT ?? null);
    if (this.coordsSwapMode === 'legacy') {
      // legacy(Spring 1:1): lat/lot swap
      festival.lat = lot;
      festival.lot = lat;
    } else {
      festival.lat = lat;
      festival.lot = lot;
    }

    // 멱등성/중복 방지용 키들
    festival.openApiId = row.CULTCODE ?? null;
    // 고유 ID가 없더라도 운영에서 중복 누적을 최소화하기 위한 후보키
    // (title + strt_date + end_date + place)
    const dedupeSource = [
      festival.title ?? '',
      festival.strtDate ? festival.strtDate.toISOString() : '',
      festival.endDate ? festival.endDate.toISOString() : '',
      festival.place ?? '',
    ].join('|');
    festival.dedupeKey = buildDedupeKey(dedupeSource);

    festival.subCodeName = row.CODENAME ?? null;
    festival.majorCodeName = EventCategoryUtil.getCategory(row.CODENAME ?? null);
    festival.guName = row.GUNAME ?? null;
    festival.orgName = row.ORG_NAME ?? null;
    festival.useTrgt = row.USE_TRGT ?? null;
    festival.date = row.DATE ?? null;
    festival.isFree = row.IS_FREE ?? null;

    // TODO: Open API에 없거나 현재 row에서 안 쓰는 필드는 null 유지
    festival.content = null;
    festival.address = null;
    festival.phone = null;
    festival.thumbImg = null;

    return festival;
  }

  toResponse(entity: Festival): FestivalResponse {
    return {
      id: entity.id,
      title: entity.title ?? null,
      content: entity.content ?? null,
      address: entity.address ?? null,
      place: entity.place ?? null,
      phone: entity.phone ?? null,
      mainImg: entity.mainImg ?? null,
      thumbImg: entity.thumbImg ?? null,
      festivalView: entity.festivalView ?? 0,
      festivalLike: entity.festivalLike ?? 0,
      strtDate: entity.strtDate ?? null,
      endDate: entity.endDate ?? null,
      lat: entity.lat ?? null,
      lot: entity.lot ?? null,
      orgLink: entity.orgLink ?? null,
      // Spring 응답 1:1 필드들(Phase E에서 DB 컬럼 추가로 실제 값 채움)
      isFree: entity.isFree ?? null,
      majorCodeName: entity.majorCodeName ?? null,
      guName: entity.guName ?? null,
      subCodeName: entity.subCodeName ?? null,
    };
  }

  toNearResponse(entity: Festival, distanceKm: number): FestivalNearResponse {
    return {
      ...this.toResponse(entity),
      distanceKm: Number.isFinite(distanceKm) ? distanceKm : 0,
    };
  }

  toDetailResponse(
    entity: Festival,
    interaction?: { liked: boolean | null; bookmarked: boolean | null },
  ): FestivalDetailResponse {
    return {
      id: entity.id,
      title: entity.title ?? null,
      content: entity.content ?? null,
      address: entity.address ?? null,
      place: entity.place ?? null,
      phone: entity.phone ?? null,
      mainImg: entity.mainImg ?? null,
      thumbImg: entity.thumbImg ?? null,
      festivalView: entity.festivalView ?? 0,
      festivalLike: entity.festivalLike ?? 0,
      liked: interaction?.liked ?? null,
      bookmarked: interaction?.bookmarked ?? null,
      strtDate: entity.strtDate ?? null,
      endDate: entity.endDate ?? null,
      lat: entity.lat ?? null,
      lot: entity.lot ?? null,
      orgLink: entity.orgLink ?? null,
      isFree: entity.isFree ?? null,
      majorCodeName: entity.majorCodeName ?? null,
      guName: entity.guName ?? null,
      subCodeName: entity.subCodeName ?? null,
    };
  }

  toSearchResponse(entity: Festival): FestivalSearchResponse {
    return {
      id: entity.id,
      title: entity.title ?? null,
      place: entity.place ?? null,
      address: entity.address ?? null,
      strtDate: entity.strtDate ?? null,
      endDate: entity.endDate ?? null,
      mainImg: entity.mainImg ?? null,
      thumbImg: entity.thumbImg ?? null,
      festivalView: entity.festivalView ?? 0,
      festivalLike: entity.festivalLike ?? 0,
      isFree: entity.isFree ?? null,
      majorCodeName: entity.majorCodeName ?? null,
      guName: entity.guName ?? null,
      subCodeName: entity.subCodeName ?? null,
    };
  }

  toFilterResponse(entity: Festival): FestivalFilterResponse {
    return {
      id: entity.id,
      title: entity.title ?? null,
      place: entity.place ?? null,
      strtDate: entity.strtDate ?? null,
      endDate: entity.endDate ?? null,
      mainImg: entity.mainImg ?? null,
      thumbImg: entity.thumbImg ?? null,
      festivalView: entity.festivalView ?? 0,
      festivalLike: entity.festivalLike ?? 0,
      isFree: entity.isFree ?? null,
      majorCodeName: entity.majorCodeName ?? null,
      guName: entity.guName ?? null,
      subCodeName: entity.subCodeName ?? null,
    };
  }

  toMostResponse(entity: Festival): FestivalMostResponse {
    return {
      id: entity.id,
      title: entity.title ?? null,
      place: entity.place ?? null,
      festivalView: entity.festivalView ?? 0,
      festivalLike: entity.festivalLike ?? 0,
      mainImg: entity.mainImg ?? null,
      thumbImg: entity.thumbImg ?? null,
      isFree: entity.isFree ?? null,
      majorCodeName: entity.majorCodeName ?? null,
      guName: entity.guName ?? null,
      subCodeName: entity.subCodeName ?? null,
    };
  }
}

