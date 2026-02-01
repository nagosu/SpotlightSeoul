/**
 * 타이틀 검색 요청 (Swagger FestivalSearchRequest 스키마)
 */
export interface FestivalSearchRequest {
  /** 검색할 타이틀 (부분 일치, REPLACE 포함) */
  title: string;
}

/**
 * 타이틀 검색 응답 (Swagger FestivalSearchResponse 스키마)
 */
import type { FestivalCardBase } from './base';

export interface FestivalSearchResponse extends FestivalCardBase {
  /** 주소 */
  address: string | null;
}

/**
 * 자동완성 응답 (Swagger FestivalSuggestResponse 스키마)
 */
export interface FestivalSuggestResponse {
  /** 추천 검색어 목록 */
  suggestions: string[];
}

/**
 * 자동완성 쿼리 파라미터
 */
export interface FestivalSuggestParams {
  /** 검색어 (타이틀 자동완성) */
  q: string;
  /** 최대 개수 */
  limit?: number;
}
