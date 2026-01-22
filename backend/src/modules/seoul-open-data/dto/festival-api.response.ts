export type FestivalRow = {
  // 가능하면 고유 ID(오픈 API가 제공하는 경우). 실제 키는 데이터셋/버전에 따라 다를 수 있음.
  // TODO: Spring 원본/문서 기준 고유키가 확정되면 정확한 필드명으로 통일
  CULTCODE?: string;

  CODENAME?: string;
  GUNAME?: string;
  ORG_NAME?: string;
  USE_TRGT?: string;
  DATE?: string;
  END_DATE?: string;
  STRTDATE?: string;
  ORG_LINK?: string;
  MAIN_IMG?: string;
  LAT?: string;
  LOT?: string;
  PLACE?: string;
  TITLE?: string;
  IS_FREE?: string;
  // ... 기타 필드는 필요 시 추가
};

export type CulturalEventInfo = {
  list_total_count: number;
  row?: FestivalRow[];
};

export type FestivalApiResponse = {
  culturalEventInfo?: CulturalEventInfo;
};

