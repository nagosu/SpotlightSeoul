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
