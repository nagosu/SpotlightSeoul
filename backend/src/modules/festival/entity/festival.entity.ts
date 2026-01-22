import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index('IDX_festival_is_end', ['isEnd'])
@Index('IDX_festival_festival_like', ['festivalLike'])
@Index('IDX_festival_festival_view', ['festivalView'])
@Index('IDX_festival_end_date', ['endDate'])
@Index('IDX_festival_strt_date', ['strtDate'])
@Index('IDX_festival_title', ['title'])
@Index('UQ_festival_open_api_id', ['openApiId'], { unique: true })
@Index('UQ_festival_dedupe_key', ['dedupeKey'], { unique: true })
@Entity({ name: 'festival' })
export class Festival {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  // Spring 요약에서 지정된 필드들(1:1 이식)
  @Column({ name: 'is_end', type: 'boolean', nullable: true })
  isEnd: boolean | null;

  @Column({ name: 'festival_view', type: 'int', default: 0 })
  festivalView: number;

  @Column({ name: 'festival_like', type: 'int', default: 0 })
  festivalLike: number;

  @Column({ name: 'end_date', type: 'datetime', precision: 0, nullable: true })
  endDate: Date | null;

  @Column({ name: 'strt_date', type: 'datetime', precision: 0, nullable: true })
  strtDate: Date | null;

  @Column({ name: 'lat', type: 'double', nullable: true })
  lat: number | null;

  @Column({ name: 'lot', type: 'double', nullable: true })
  lot: number | null;

  @Column({ name: 'org_link', type: 'longtext', nullable: true })
  orgLink: string | null;

  // --- Open API 연동(Phase E) 컬럼들 ---
  @Column({ name: 'open_api_id', type: 'varchar', length: 255, nullable: true })
  openApiId: string | null;

  @Column({ name: 'dedupe_key', type: 'varchar', length: 64, nullable: true })
  dedupeKey: string | null;

  @Column({ name: 'major_code_name', type: 'varchar', length: 255, nullable: true })
  majorCodeName: string | null;

  @Column({ name: 'sub_code_name', type: 'varchar', length: 255, nullable: true })
  subCodeName: string | null;

  @Column({ name: 'gu_name', type: 'varchar', length: 255, nullable: true })
  guName: string | null;

  @Column({ name: 'org_name', type: 'varchar', length: 255, nullable: true })
  orgName: string | null;

  @Column({ name: 'use_trgt', type: 'longtext', nullable: true })
  useTrgt: string | null;

  // 원본이 문자열(가공 데이터)이라 varchar/longtext로 보관
  @Column({ name: 'date', type: 'longtext', nullable: true })
  date: string | null;

  // 원본이 문자열일 수 있어 varchar로 보관(예: "무료", "유료", "Y" 등)
  @Column({ name: 'is_free', type: 'varchar', length: 50, nullable: true })
  isFree: string | null;

  // 그 외 필드(축제 도메인 기본 정보). Spring 엔티티 요약과 맞춰 필요 시 조정/확장.
  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string | null;

  @Column({ name: 'content', type: 'longtext', nullable: true })
  content: string | null;

  @Column({ name: 'address', type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ name: 'place', type: 'varchar', length: 255, nullable: true })
  place: string | null;

  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @Column({ name: 'main_img', type: 'varchar', length: 1000, nullable: true })
  mainImg: string | null;

  @Column({ name: 'thumb_img', type: 'varchar', length: 1000, nullable: true })
  thumbImg: string | null;
}

