/**
 * 기본 축제 정보 (Swagger FestivalResponse 스키마)
 */
export interface FestivalResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 내용 */
  content: string | null;
  /** 주소 */
  address: string | null;
  /** 장소 */
  place: string | null;
  /** 문의 전화 */
  phone: string | null;
  /** 대표 이미지 URL */
  main_img: string | null;
  /** 썸네일 이미지 URL */
  thumb_img: string | null;
  /** 조회수 */
  festival_view: number;
  /** 좋아요 수 */
  festival_like: number;
  /** 시작일 (ISO 문자열) */
  strt_date: string | null;
  /** 종료일 (ISO 문자열) */
  end_date: string | null;
  /** 위도 */
  lat: number | null;
  /** 경도 */
  lot: number | null;
  /** 주관/상세 링크 */
  org_link: string | null;
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
 * 축제 상세 조회 응답 (Swagger FestivalDetailResponse 스키마)
 */
export interface FestivalDetailResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 내용 */
  content: string | null;
  /** 주소 */
  address: string | null;
  /** 장소 */
  place: string | null;
  /** 문의 전화 */
  phone: string | null;
  /** 대표 이미지 URL */
  main_img: string | null;
  /** 썸네일 이미지 URL */
  thumb_img: string | null;
  /** 조회수 */
  festival_view: number;
  /** 좋아요 수 */
  festival_like: number;
  /** 시작일 (ISO 문자열) */
  strt_date: string | null;
  /** 종료일 (ISO 문자열) */
  end_date: string | null;
  /** 위도 */
  lat: number | null;
  /** 경도 */
  lot: number | null;
  /** 주관/상세 링크 */
  org_link: string | null;
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
 * 필터 검색 응답 (Swagger FestivalFilterResponse 스키마)
 */
export interface FestivalFilterResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 장소 */
  place: string | null;
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
 * 주변 축제 응답 (Swagger FestivalNearResponse 스키마)
 */
export interface FestivalNearResponse {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 내용 */
  content: string | null;
  /** 주소 */
  address: string | null;
  /** 장소 */
  place: string | null;
  /** 문의 전화 */
  phone: string | null;
  /** 대표 이미지 URL */
  main_img: string | null;
  /** 썸네일 이미지 URL */
  thumb_img: string | null;
  /** 조회수 */
  festival_view: number;
  /** 좋아요 수 */
  festival_like: number;
  /** 시작일 (ISO 문자열) */
  strt_date: string | null;
  /** 종료일 (ISO 문자열) */
  end_date: string | null;
  /** 위도 */
  lat: number | null;
  /** 경도 */
  lot: number | null;
  /** 주관/상세 링크 */
  org_link: string | null;
  /** 무료 여부 (원본 데이터 문자열) */
  is_free: string | null;
  /** 대분류 */
  major_code_name: string | null;
  /** 구 */
  gu_name: string | null;
  /** 소분류 */
  sub_code_name: string | null;
  /** 거리 (km) */
  distance_km: number;
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
 * 자동완성 응답 (Swagger FestivalSuggestResponse 스키마)
 */
export interface FestivalSuggestResponse {
  /** 추천 검색어 목록 */
  suggestions: string[];
}

/**
 * 타이틀 검색 요청 (Swagger FestivalSearchRequest 스키마)
 */
export interface FestivalSearchRequest {
  /** 검색할 타이틀 (부분 일치, REPLACE 포함) */
  title: string;
}

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

/**
 * 자동완성 쿼리 파라미터
 */
export interface FestivalSuggestParams {
  /** 검색어 (타이틀 자동완성) */
  q: string;
  /** 최대 개수 */
  limit?: number;
}
