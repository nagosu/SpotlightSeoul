import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SeoulOpenDataClient } from './seoul-open-data.client';
import { FestivalRepository } from '../festival/repository/festival.repository';
import { FestivalMapper } from '../festival/festival.mapper';
import { Festival } from '../festival/entity/festival.entity';
import { FestivalRow } from './dto/festival-api.response';

type OpenDataRunStatus = {
  lastRunAt: Date | null;
  lastSuccess: boolean | null;
  lastProcessedCount: number;
  lastDurationMs: number | null;
  lastErrorMessage: string | null;
};

@Injectable()
export class SeoulOpenDataService {
  private readonly logger = new Logger(SeoulOpenDataService.name);
  private readonly status: OpenDataRunStatus = {
    lastRunAt: null,
    lastSuccess: null,
    lastProcessedCount: 0,
    lastDurationMs: null,
    lastErrorMessage: null,
  };

  constructor(
    private readonly config: ConfigService,
    private readonly client: SeoulOpenDataClient,
    private readonly festivalRepository: FestivalRepository,
    private readonly festivalMapper: FestivalMapper,
    private readonly dataSource: DataSource,
  ) {}

  private get chunkSize(): number {
    return Number(this.config.get<string>('SEOUL_OPEN_API_CHUNK_SIZE', '999'));
  }

  getStatus(): OpenDataRunStatus {
    return { ...this.status };
  }

  async healthCheckTotalCount(): Promise<number> {
    const data = await this.client.fetchFestivalData({ start: 1, end: 1 });
    const total = data?.culturalEventInfo?.list_total_count ?? 0;
    return Number(total) || 0;
  }

  /**
   * 앱 부팅 직후 1회 전체 수집(페이지 분할: 999 단위)
   * - Phase G: 외부 호출은 client에서 retry/backoff 적용
   */
  async fetchAllAndSaveOnce(): Promise<void> {
    const startedAt = Date.now();
    this.status.lastRunAt = new Date();
    this.status.lastProcessedCount = 0;
    this.status.lastDurationMs = null;
    this.status.lastErrorMessage = null;

    const totalCount = await this.healthCheckTotalCount();
    this.logger.log(`Seoul Open API totalCount=${totalCount}`);

    if (!totalCount || totalCount <= 0) return;

    for (let start = 1; start <= totalCount; start += this.chunkSize) {
      const end = Math.min(start + this.chunkSize - 1, totalCount);
      this.logger.log(`fetch range start=${start}, end=${end}`);

      const data = await this.client.fetchFestivalData({ start, end });
      const rows: FestivalRow[] = data?.culturalEventInfo?.row ?? [];

      for (const row of rows) {
        const changed = await this.upsertFestivalData(row);
        if (changed) this.status.lastProcessedCount += 1;
      }
    }

    this.status.lastSuccess = true;
    this.status.lastDurationMs = Date.now() - startedAt;
  }

  /**
   * Phase G 멱등성/중복 방지 강화(권장):
   * - open_api_id(있으면) 또는 dedupe_key(항상 생성)를 기준으로 upsert
   *
   * TODO: 운영에서는 migration 기반으로 unique index 관리 권장
   */
  async upsertFestivalData(row: FestivalRow): Promise<boolean> {
    const title = row.TITLE?.trim();
    if (!title) return false;

    const entity = this.festivalMapper.fromFestivalRow(row);

    // insert ... on duplicate key update
    // - open_api_id가 있으면 그 unique를 타겟으로
    // - 없으면 dedupe_key(unique)로 타겟
    const manager = this.dataSource.manager;
    const insert = manager
      .createQueryBuilder()
      .insert()
      .into(Festival)
      .values({
        isEnd: null,
        festivalView: entity.festivalView,
        festivalLike: entity.festivalLike,
        endDate: entity.endDate,
        strtDate: entity.strtDate,
        lat: entity.lat,
        lot: entity.lot,
        orgLink: entity.orgLink,
        openApiId: entity.openApiId,
        dedupeKey: entity.dedupeKey,
        majorCodeName: entity.majorCodeName,
        subCodeName: entity.subCodeName,
        guName: entity.guName,
        orgName: entity.orgName,
        useTrgt: entity.useTrgt,
        date: entity.date,
        isFree: entity.isFree,
        title: entity.title,
        content: entity.content,
        address: entity.address,
        place: entity.place,
        phone: entity.phone,
        mainImg: entity.mainImg,
        thumbImg: entity.thumbImg,
      } as any);

    const overwrite = [
      'end_date',
      'strt_date',
      'lat',
      'lot',
      'org_link',
      'major_code_name',
      'sub_code_name',
      'gu_name',
      'org_name',
      'use_trgt',
      'date',
      'is_free',
      'title',
      'place',
      'main_img',
      'open_api_id',
      'dedupe_key',
    ];

    if (entity.openApiId) {
      await insert.orUpdate(overwrite, ['open_api_id']).execute();
    } else {
      await insert.orUpdate(overwrite, ['dedupe_key']).execute();
    }

    return true;
  }

  /**
   * 종료 처리(필수):
   * - end_date < now 이고 is_end IS NULL 인 축제들을 is_end=true로 변경
   */
  async endExpiredFestivals(): Promise<number> {
    const now = new Date();

    return this.dataSource.transaction(async (manager) => {
      const repo = manager.getRepository(Festival);

      const targets = await repo
        .createQueryBuilder('festival')
        .where('festival.is_end IS NULL')
        .andWhere('festival.end_date IS NOT NULL')
        .andWhere('festival.end_date < :now', { now })
        .getMany();

      for (const f of targets) {
        f.isEnd = true;
        await repo.save(f);
      }

      // TODO: 동시성/성능 관점에선 UPDATE 쿼리 1방으로 처리 가능
      return targets.length;
    });
  }
}

