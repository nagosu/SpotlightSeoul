/**
 * 모든 Festival 응답의 공통 필드 (최소 단위)
 */
export interface FestivalBase {
  /** 축제 ID */
  id: string;
  /** 타이틀 */
  title: string | null;
  /** 장소 */
  place: string | null;
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
 * 카드/리스트용 (기간 포함)
 */
export interface FestivalCardBase extends FestivalBase {
  /** 시작일 (ISO 문자열) */
  strt_date: string | null;
  /** 종료일 (ISO 문자열) */
  end_date: string | null;
}

/**
 * 상세/전체 필드
 */
export interface FestivalFull extends FestivalCardBase {
  /** 내용 */
  content: string | null;
  /** 주소 */
  address: string | null;
  /** 문의 전화 */
  phone: string | null;
  /** 위도 */
  lat: number | null;
  /** 경도 */
  lot: number | null;
  /** 주관/상세 링크 */
  org_link: string | null;
}
