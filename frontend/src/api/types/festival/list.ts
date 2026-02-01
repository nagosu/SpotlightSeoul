/**
 * 기본 축제 정보 (Swagger FestivalResponse 스키마)
 */
import type { FestivalFull } from './base';

export interface FestivalResponse extends FestivalFull {}

/**
 * 축제 리스트 쿼리 파라미터
 */
export interface FestivalListParams {
  /** 타이틀 (부분 일치) */
  title?: string;
  /** 장소 (부분 일치) */
  place?: string;
  /** 무료 여부 */
  isFree?: boolean;
  /** 대분류 */
  majorCodeName?: string;
  /** 구 */
  guName?: string;
  /** 소분류 */
  subCodeName?: string;
  /** 시작일 (YYYY-MM-DD) */
  strtDate?: string;
  /** 종료일 (YYYY-MM-DD) */
  endDate?: string;
  /** 페이지 (0부터 시작) */
  page?: number;
  /** 페이지 크기 (최대 100) */
  size?: number;
  /** 상태 필터 */
  status?: 'all' | 'upcoming' | 'ongoing' | 'ended';
  /** 정렬 기준 */
  sort?: 'recent' | 'like' | 'view' | 'end_date';
}
