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
export interface FestivalSearchResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 장소 */
  place: string | null;
  /** 주소 */
  address: string | null;
  /** 시작일 (ISO 문자열) */
  strt_date: string | null;
  /** 종료일 (ISO 문자열) */
  end_date: string | null;
  /** 대표 이미지 URL */
  main_img: string | null;
  /** 썸네일 이미지 URL */
  thumb_img: string | null;
  /** 조회수 */
  festival_view: number;
  /** 좋아요 수 */
  festival_like: number;
  /** 무료 여부 (원본 데이터 문자열) */
  is_free: string | null;
  /** 대분류 */
  major_code_name: string | null;
  /** 구 */
  gu_name: string | null;
  /** 소분류 */
  sub_code_name: string | null;
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
