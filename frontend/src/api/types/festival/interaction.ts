/**
 * 좋아요 응답 (Swagger FestivalLikeResponse 스키마)
 */
export interface FestivalLikeResponse {
  /** 좋아요 수 */
  festival_like: number;
}

/**
 * 좋아요 토글 응답 (Swagger FestivalLikeToggleResponse 스키마)
 */
export interface FestivalLikeToggleResponse {
  /** 좋아요 수 */
  festival_like: number;
  /** 좋아요 여부 */
  liked: boolean;
}

/**
 * 북마크 토글 응답 (Swagger FestivalBookmarkToggleResponse 스키마)
 */
export interface FestivalBookmarkToggleResponse {
  /** 북마크 여부 */
  bookmarked: boolean;
}

/**
 * Most 리스트 응답 (Swagger FestivalMostResponse 스키마)
 */
import type { FestivalBase } from './base';

export interface FestivalMostResponse extends FestivalBase {}
