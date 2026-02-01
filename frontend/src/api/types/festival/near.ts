/**
 * 주변 축제 응답 (Swagger FestivalNearResponse 스키마)
 */
import type { FestivalFull } from './base';

export interface FestivalNearResponse extends FestivalFull {
  /** 거리 (km) */
  distance_km: number;
}

/**
 * 주변 축제 쿼리 파라미터
 */
export interface FestivalNearParams {
  /** 현재 위도 */
  lat: number;
  /** 현재 경도 */
  lot: number;
  /** 반경 (km) */
  radius_km?: number;
  /** 상태 필터 */
  status?: 'all' | 'upcoming' | 'ongoing' | 'ended';
  /** 페이지 (0부터 시작) */
  page?: number;
  /** 페이지 크기 (최대 100) */
  size?: number;
}
