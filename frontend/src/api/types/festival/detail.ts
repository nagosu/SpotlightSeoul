/**
 * 축제 상세 조회 응답 (Swagger FestivalDetailResponse 스키마)
 */
import type { FestivalFull } from './base';

export interface FestivalDetailResponse extends FestivalFull {
  /**
   * 현재 로그인 사용자의 좋아요 상태
   * - API 미지원/비로그인 상태에서는 undefined 또는 null일 수 있습니다.
   */
  liked?: boolean | null;
  /**
   * 현재 로그인 사용자의 북마크 상태
   * - API 미지원/비로그인 상태에서는 undefined 또는 null일 수 있습니다.
   */
  bookmarked?: boolean | null;
}
