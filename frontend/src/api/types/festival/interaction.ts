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
export interface FestivalMostResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 장소 */
  place: string | null;
  /** 조회수 */
  festival_view: number;
  /** 좋아요 수 */
  festival_like: number;
  /** 대표 이미지 URL */
  main_img: string | null;
  /** 썸네일 이미지 URL */
  thumb_img: string | null;
  /** 무료 여부 (원본 데이터 문자열) */
  is_free: string | null;
  /** 대분류 */
  major_code_name: string | null;
  /** 구 */
  gu_name: string | null;
  /** 소분류 */
  sub_code_name: string | null;
}
