import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Festival } from '../entity/festival.entity';
import { FestivalUserBookmark } from '../entity/festival-user-bookmark.entity';
import { FestivalUserLike } from '../entity/festival-user-like.entity';
import { FestivalFilterQuery } from '../dto/response/festival-filter-query';
import { FestivalListQuery } from '../dto/response/festival-list-query';
import { FestivalSuggestQuery } from '../dto/response/festival-suggest-query';

@Injectable()
export class FestivalRepository {
  private readonly repo: Repository<Festival>;
  private readonly likeRepo: Repository<FestivalUserLike>;
  private readonly bookmarkRepo: Repository<FestivalUserBookmark>;

  constructor(private readonly dataSource: DataSource) {
    this.repo = this.dataSource.getRepository(Festival);
    this.likeRepo = this.dataSource.getRepository(FestivalUserLike);
    this.bookmarkRepo = this.dataSource.getRepository(FestivalUserBookmark);
  }

  /**
   * Spring @Where(is_end is null) 대체.
   * 서비스에서는 이 QB를 기반으로만 조회하도록 강제한다.
   */
  festivalQb(alias = 'festival'): SelectQueryBuilder<Festival> {
    return this.repo.createQueryBuilder(alias).where(`${alias}.is_end IS NULL`);
  }

  /**
   * 권장: 서비스에서는 qb()만 호출해서 체이닝한다.
   * (기존 festivalQb 이름도 유지)
   */
  qb(alias = 'festival'): SelectQueryBuilder<Festival> {
    return this.festivalQb(alias);
  }

  async findPage(offset: number, size: number) {
    const qb = this.qb();

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;

    const postResponses = await this.qb()
      .orderBy('festival.id', 'DESC')
      .skip(offset * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  async findByIdOrFail(id: string): Promise<Festival> {
    const festival = await this.qb().andWhere('festival.id = :id', { id }).getOne();
    if (!festival) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');
    return festival;
  }

  async searchByTitle(keyword: string, page: number, size: number) {
    const kw = keyword ?? '';
    const like = `%${kw}%`;

    const base = this.qb().andWhere(
      new Brackets((sub) => {
        sub.where('festival.title LIKE :like', { like }).orWhere(
          "REPLACE(festival.title,' ','') LIKE :like",
          { like },
        );
      }),
    );

    const total = await base.getCount();
    if (total === 0) throw new BadRequestException('검색결과가 없습니다.');

    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;
    const postResponses = await base
      .orderBy('festival.id', 'DESC')
      .skip(page * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  async filter(query: FestivalFilterQuery, page: number, size: number) {
    let qb = this.qb();

    if (query.title) {
      qb = qb.andWhere('festival.title LIKE :title', { title: `%${query.title}%` });
    }
    if (query.place) {
      qb = qb.andWhere('festival.place = :place', { place: query.place });
    }

    // TODO: Spring 1:1 필터지만 현재 DB에 컬럼이 없어서 적용 불가(is_free/major_code_name/gu_name/sub_code_name)
    // - query.isFree / query.majorCodeName / query.guName / query.subCodeName 은 무시한다.

    if (query.strtDate) {
      const start = new Date(`${query.strtDate}T00:00:00+09:00`);
      qb = qb.andWhere('festival.strt_date >= :start', { start });
    }
    if (query.endDate) {
      const end = new Date(`${query.endDate}T23:59:59+09:00`);
      qb = qb.andWhere('festival.end_date <= :end', { end });
    }

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;

    const postResponses = await qb
      .orderBy('festival.id', 'DESC')
      .skip(page * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  /**
   * Phase H(사용자 기능): 기간/상태/정렬 통합 리스트
   * - 기존 endpoint는 그대로 유지하고, GET /festivals (신규)에서만 사용한다.
   */
  async list(query: FestivalListQuery, page: number, size: number) {
    let qb = this.qb();

    // 기존 filter 조건 재사용
    if (query.title) {
      qb = qb.andWhere('festival.title LIKE :title', { title: `%${query.title}%` });
    }
    if (query.place) {
      qb = qb.andWhere('festival.place = :place', { place: query.place });
    }

    // TODO: Spring 1:1 필터지만 현재 DB에 컬럼이 없어서 적용 불가(is_free/major_code_name/gu_name/sub_code_name)

    if (query.strtDate) {
      const start = new Date(`${query.strtDate}T00:00:00+09:00`);
      qb = qb.andWhere('festival.strt_date >= :start', { start });
    }
    if (query.endDate) {
      const end = new Date(`${query.endDate}T23:59:59+09:00`);
      qb = qb.andWhere('festival.end_date <= :end', { end });
    }

    // 상태 필터
    const status = (query.status ?? 'all').toLowerCase();
    const now = new Date();
    if (status === 'upcoming') {
      qb = qb.andWhere('festival.strt_date IS NOT NULL').andWhere('festival.strt_date > :now', {
        now,
      });
    } else if (status === 'ongoing') {
      qb = qb
        .andWhere('festival.strt_date IS NOT NULL')
        .andWhere('festival.strt_date <= :now', { now })
        .andWhere('(festival.end_date IS NULL OR festival.end_date >= :now)', { now });
    } else if (status === 'ended') {
      qb = qb.andWhere('festival.end_date IS NOT NULL').andWhere('festival.end_date < :now', { now });
    }

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;

    // 정렬
    const sort = (query.sort ?? 'recent').toLowerCase();
    if (sort === 'like') {
      qb = qb.orderBy('festival.festival_like', 'DESC').addOrderBy('festival.id', 'DESC');
    } else if (sort === 'view') {
      qb = qb.orderBy('festival.festival_view', 'DESC').addOrderBy('festival.id', 'DESC');
    } else if (sort === 'end_date') {
      // NULL은 뒤로 보내고(end_date 없는 데이터는 마지막), 빠른 종료가 먼저
      qb = qb
        .orderBy('festival.end_date IS NULL', 'ASC')
        .addOrderBy('festival.end_date', 'ASC')
        .addOrderBy('festival.id', 'DESC');
    } else {
      // recent (기본): 시작일 최신순 -> id desc
      qb = qb.orderBy('festival.strt_date', 'DESC').addOrderBy('festival.id', 'DESC');
    }

    const postResponses = await qb
      .skip(page * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  /**
   * 사용자 기능: 내 주변 축제(거리순)
   * - MySQL에서 하버사인 기반 거리(km) 계산으로 정렬한다.
   * - 좌표가 없는 데이터는 제외한다.
   */
  async near(
    lat: number,
    lot: number,
    radiusKm: number,
    page: number,
    size: number,
    coordsSwapMode: 'legacy' | 'fixed',
    status: 'all' | 'upcoming' | 'ongoing' | 'ended' = 'all',
  ) {
    // FESTIVAL_COORDS_SWAP_MODE=legacy 인 경우 DB에 lat/lot이 스왑되어 저장되어 있을 수 있다.
    // - legacy: entity.lat=경도, entity.lot=위도(스왑 저장) -> 거리 계산 시 festival.lot(위도), festival.lat(경도) 사용
    // - fixed : entity.lat=위도, entity.lot=경도(정상) -> 거리 계산 시 festival.lat(위도), festival.lot(경도) 사용
    const latCol = coordsSwapMode === 'legacy' ? 'festival.lot' : 'festival.lat';
    const lotCol = coordsSwapMode === 'legacy' ? 'festival.lat' : 'festival.lot';

    // acos 입력이 부동소수점 오차로 [-1,1]을 벗어나 NaN 되는 케이스를 방지하기 위해 clamp
    const inner =
      `COS(RADIANS(:lat)) * COS(RADIANS(${latCol})) * COS(RADIANS(${lotCol}) - RADIANS(:lot)) + ` +
      `SIN(RADIANS(:lat)) * SIN(RADIANS(${latCol}))`;
    const distanceKmExpr = `(6371 * ACOS(LEAST(1, GREATEST(-1, (${inner})))))`;

    let qb = this.qb()
      .andWhere('festival.lat IS NOT NULL')
      .andWhere('festival.lot IS NOT NULL')
      .setParameters({ lat, lot });

    // 상태 필터 (날짜 NULL 안전)
    const now = new Date();
    const s = (status ?? 'all').toLowerCase();
    if (s === 'upcoming') {
      qb = qb.andWhere('festival.strt_date IS NOT NULL').andWhere('festival.strt_date > :now', {
        now,
      });
    } else if (s === 'ongoing') {
      qb = qb
        .andWhere('festival.strt_date IS NOT NULL')
        .andWhere('festival.strt_date <= :now', { now })
        .andWhere('(festival.end_date IS NULL OR festival.end_date >= :now)', { now });
    } else if (s === 'ended') {
      qb = qb.andWhere('festival.end_date IS NOT NULL').andWhere('festival.end_date < :now', { now });
    }

    if (Number.isFinite(radiusKm) && radiusKm >= 0) {
      qb = qb.andWhere(`${distanceKmExpr} <= :radiusKm`, { radiusKm });
    }

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;

    const paged = qb
      .clone()
      .addSelect(distanceKmExpr, 'distance_km')
      .orderBy('distance_km', 'ASC')
      .addOrderBy('festival.id', 'DESC')
      .skip(page * size)
      .take(size);

    const { entities, raw } = await paged.getRawAndEntities();

    const distancesKm = raw.map((r: any) => Number(r?.distance_km ?? r?.distanceKm ?? NaN));
    return { totalPageNum, postResponses: entities, distancesKm };
  }

  /**
   * 사용자 기능: 검색 자동완성(타이틀)
   * - 빈 문자열은 service에서 걸러낸다.
   * - 기본필터(qb) 유지
   */
  async suggestTitles(query: FestivalSuggestQuery): Promise<string[]> {
    const q = (query.q ?? '').trim();
    const limit = Math.min(Math.max(Number(query.limit ?? 10) || 10, 1), 20);

    // 공백 제거 버전도 같이 매칭
    const like = `%${q}%`;
    const likeNoSpaces = `%${q.replace(/\s+/g, '')}%`;

    const rows = await this.qb()
      .select('festival.title', 'title')
      .addSelect('MAX(festival.id)', 'max_id')
      .andWhere('festival.title IS NOT NULL')
      .andWhere(
        new Brackets((sub) => {
          sub.where('festival.title LIKE :like', { like }).orWhere(
            "REPLACE(festival.title,' ','') LIKE :likeNoSpaces",
            { likeNoSpaces },
          );
        }),
      )
      .groupBy('festival.title')
      .orderBy('max_id', 'DESC')
      .limit(limit)
      .getRawMany<{ title: string; max_id: string }>();

    return rows
      .map((r) => r?.title)
      .filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
  }

  async increaseLike(id: string): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Festival);
      const festival = await repo
        .createQueryBuilder('festival')
        .where('festival.is_end IS NULL')
        .andWhere('festival.id = :id', { id })
        .getOne();

      if (!festival) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      // Spring dirty-checking 방식에 가깝게: 로드 -> 증가 -> save (트랜잭션)
      // TODO: 동시성(원자성) 관점에선 UPDATE festival_like = festival_like + 1 방식도 가능
      festival.festivalLike = (festival.festivalLike ?? 0) + 1;
      await repo.save(festival);
      return festival.festivalLike;
    });
  }

  async increaseView(id: string): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Festival);
      const festival = await repo
        .createQueryBuilder('festival')
        .where('festival.is_end IS NULL')
        .andWhere('festival.id = :id', { id })
        .getOne();

      if (!festival) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      // Spring dirty-checking 방식에 가깝게: 로드 -> 증가 -> save (트랜잭션)
      // TODO: 동시성(원자성) 관점에선 UPDATE festival_view = festival_view + 1 방식도 가능
      festival.festivalView = (festival.festivalView ?? 0) + 1;
      await repo.save(festival);
      return festival.festivalView;
    });
  }

  /**
   * Phase G (선택): 원자 업데이트 모드
   * - UPDATE ... SET festival_view = festival_view + 1
   */
  async increaseViewAtomic(id: string): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Festival);

      const r = await repo
        .createQueryBuilder()
        .update(Festival)
        .set({ festivalView: () => 'COALESCE(festival_view, 0) + 1' } as any)
        .where('id = :id', { id })
        .andWhere('is_end IS NULL')
        .execute();

      if (!r.affected) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      const row = await repo
        .createQueryBuilder('festival')
        .select('festival.festival_view', 'festival_view')
        .where('festival.id = :id', { id })
        .getRawOne<{ festival_view: number }>();

      return Number(row?.festival_view ?? 0);
    });
  }

  /**
   * Phase G (선택): 원자 업데이트 모드
   * - UPDATE ... SET festival_like = festival_like + 1
   */
  async increaseLikeAtomic(id: string): Promise<number> {
    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Festival);

      const r = await repo
        .createQueryBuilder()
        .update(Festival)
        .set({ festivalLike: () => 'COALESCE(festival_like, 0) + 1' } as any)
        .where('id = :id', { id })
        .andWhere('is_end IS NULL')
        .execute();

      if (!r.affected) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      const row = await repo
        .createQueryBuilder('festival')
        .select('festival.festival_like', 'festival_like')
        .where('festival.id = :id', { id })
        .getRawOne<{ festival_like: number }>();

      return Number(row?.festival_like ?? 0);
    });
  }

  private async readFestivalLikeCount(managerRepo: Repository<Festival>, id: string): Promise<number> {
    const row = await managerRepo
      .createQueryBuilder('festival')
      .select('festival.festival_like', 'festival_like')
      .where('festival.id = :id', { id })
      .getRawOne<{ festival_like: number }>();

    return Number(row?.festival_like ?? 0);
  }

  /**
   * 사용자 기능: 좋아요 토글
   * - liked=true: (user_id, festival_id) 삽입 성공 + counter +1
   * - liked=false: 기존 row 삭제 + counter -1 (최소 0)
   */
  async toggleLike(userId: string, festivalId: string): Promise<{ festivalLike: number; liked: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      const festivalRepo = manager.getRepository(Festival);
      const likeRepo = manager.getRepository(FestivalUserLike);

      // 1) 먼저 insert 시도
      try {
        await likeRepo
          .createQueryBuilder()
          .insert()
          .into(FestivalUserLike)
          .values([{ userId, festivalId }])
          .execute();

        const r = await festivalRepo
          .createQueryBuilder()
          .update(Festival)
          .set({ festivalLike: () => 'COALESCE(festival_like, 0) + 1' } as any)
          .where('id = :festivalId', { festivalId })
          .andWhere('is_end IS NULL')
          .execute();

        if (!r.affected) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

        const festivalLike = await this.readFestivalLikeCount(festivalRepo, festivalId);
        return { festivalLike, liked: true };
      } catch (e: any) {
        // ER_DUP_ENTRY(중복)면 토글 off 처리
        const code = e?.code ?? e?.errno;
        const isDup = code === 'ER_DUP_ENTRY' || code === 1062;
        if (!isDup) throw e;
      }

      // 2) 이미 좋아요 상태 → 삭제(토글 off)
      const del = await likeRepo
        .createQueryBuilder()
        .delete()
        .from(FestivalUserLike)
        .where('user_id = :userId', { userId })
        .andWhere('festival_id = :festivalId', { festivalId })
        .execute();

      if (!del.affected) {
        // 중복 에러를 받았는데 삭제가 안되면(경합) 그냥 현재 상태를 0/false로 정리
        const festivalLike = await this.readFestivalLikeCount(festivalRepo, festivalId);
        return { festivalLike, liked: false };
      }

      const r2 = await festivalRepo
        .createQueryBuilder()
        .update(Festival)
        .set({ festivalLike: () => 'GREATEST(COALESCE(festival_like, 0) - 1, 0)' } as any)
        .where('id = :festivalId', { festivalId })
        .andWhere('is_end IS NULL')
        .execute();

      if (!r2.affected) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      const festivalLike = await this.readFestivalLikeCount(festivalRepo, festivalId);
      return { festivalLike, liked: false };
    });
  }

  /**
   * 사용자 기능: 북마크(찜) 토글
   * - festival_like 카운터와 별개로, 사용자별 리스트 용도
   */
  async toggleBookmark(
    userId: string,
    festivalId: string,
  ): Promise<{ bookmarked: boolean }> {
    return this.dataSource.transaction(async (manager) => {
      const festivalRepo = manager.getRepository(Festival);
      const bookmarkRepo = manager.getRepository(FestivalUserBookmark);

      // 존재/기본필터 체크(종료된 축제는 북마크 불가)
      const exists = await festivalRepo
        .createQueryBuilder('festival')
        .where('festival.is_end IS NULL')
        .andWhere('festival.id = :festivalId', { festivalId })
        .getOne();
      if (!exists) throw new NotFoundException('해당 축제를 찾을 수 없습니다.');

      // 1) insert 시도
      try {
        await bookmarkRepo
          .createQueryBuilder()
          .insert()
          .into(FestivalUserBookmark)
          .values([{ userId, festivalId }])
          .execute();
        return { bookmarked: true };
      } catch (e: any) {
        const code = e?.code ?? e?.errno;
        const isDup = code === 'ER_DUP_ENTRY' || code === 1062;
        if (!isDup) throw e;
      }

      // 2) 이미 북마크 상태 → 삭제(토글 off)
      await bookmarkRepo
        .createQueryBuilder()
        .delete()
        .from(FestivalUserBookmark)
        .where('user_id = :userId', { userId })
        .andWhere('festival_id = :festivalId', { festivalId })
        .execute();

      return { bookmarked: false };
    });
  }

  /**
   * 사용자 기능: 내 북마크 목록(페이징)
   * - 최신 북마크가 먼저
   */
  async findBookmarks(userId: string, page: number, size: number) {
    // TypeORM이 JOIN + skip/take + orderBy 조합에서 DISTINCT 서브쿼리를 만들며
    // alias 컬럼을 못 찾는(MySQL) 케이스가 있어 2-step으로 조회한다.
    const bookmarkRepo = this.dataSource.getRepository(FestivalUserBookmark);

    const total = await bookmarkRepo.count({ where: { userId } as any });
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;

    const rows = await bookmarkRepo
      .createQueryBuilder('bookmark')
      .select(['bookmark.festivalId'])
      .where('bookmark.userId = :userId', { userId })
      .orderBy('bookmark.createdAt', 'DESC')
      .addOrderBy('bookmark.id', 'DESC')
      .skip(page * size)
      .take(size)
      .getMany();

    const ids = rows.map((r) => String((r as any).festivalId)).filter(Boolean);
    if (ids.length === 0) return { totalPageNum, postResponses: [] as Festival[] };

    // IN 조회 후 북마크 순서를 유지(FIELD)
    const orderParams: Record<string, string> = {};
    const placeholders = ids
      .map((id, i) => {
        const k = `fid${i}`;
        orderParams[k] = id;
        return `:${k}`;
      })
      .join(', ');

    const postResponses = await this.qb('festival')
      .andWhere('festival.id IN (:...ids)', { ids })
      .orderBy(`FIELD(festival.id, ${placeholders})`)
      .setParameters(orderParams)
      .getMany();

    return { totalPageNum, postResponses };
  }

  async mostLike(likes: number | undefined, page: number, size: number) {
    let qb = this.qb();
    if (likes !== undefined && likes !== null) {
      qb = qb.andWhere('festival.festival_like > :likes', { likes });
    }

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;
    const postResponses = await qb
      .orderBy('festival.festival_like', 'DESC')
      .skip(page * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  async mostView(views: number | undefined, page: number, size: number) {
    let qb = this.qb();

    // Spring 코드의 버그까지 1:1 복제:
    // predicate가 (views!=null) festival_like > views 인데, 정렬은 festival_view desc
    if (views !== undefined && views !== null) {
      qb = qb.andWhere('festival.festival_like > :views', { views });
    }

    const total = await qb.getCount();
    const totalPageNum = size > 0 ? Math.ceil(total / size) : 0;
    const postResponses = await qb
      .orderBy('festival.festival_view', 'DESC')
      .skip(page * size)
      .take(size)
      .getMany();

    return { totalPageNum, postResponses };
  }

  save(entity: Festival): Promise<Festival> {
    return this.repo.save(entity);
  }
}

