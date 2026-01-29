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
