import type {
  FestivalDetailResponse,
  FestivalMostResponse,
  FestivalNearResponse,
  FestivalResponse,
  FestivalSearchResponse,
  FestivalSuggestResponse,
  PageResponse,
} from '@/api/types';

const baseNow = {
  is_free: 'Y',
  gu_name: '중구',
  sub_code_name: null,
  content: null,
  address: '서울특별시 중구 세종대로 110',
  phone: null,
  lat: 37.566535,
  lot: 126.9779692,
  org_link: null,
};

export const mockFestivalListPage: PageResponse<FestivalResponse> = {
  total_page_num: 12,
  post_responses: [
    {
      id: '1',
      title: '서울 도심 야경 음악회',
      place: '서울광장',
      main_img: null,
      thumb_img: null, // 이미지 없음 케이스
      festival_view: 1234,
      festival_like: 210,
      major_code_name: '공연',
      strt_date: '2026-02-10',
      end_date: '2026-02-20',
      ...baseNow,
    },
    {
      id: '2',
      title: '현대미술 특별전: 도시의 리듬',
      place: '서울시립미술관',
      main_img: null,
      thumb_img: null,
      festival_view: 987,
      festival_like: 321,
      major_code_name: '전시',
      strt_date: '2026-01-20',
      end_date: '2026-03-02',
      ...baseNow,
      gu_name: '중구',
    },
    {
      id: '3',
      title: '한강 겨울 페스티벌',
      place: '여의도 한강공원',
      main_img: null,
      thumb_img: null,
      festival_view: 542,
      festival_like: 88,
      major_code_name: '축제',
      strt_date: '2026-02-01',
      end_date: '2026-02-28',
      ...baseNow,
      gu_name: '영등포구',
      is_free: 'N',
    },
  ],
};

export const mockFestivalMostLikePage: PageResponse<FestivalMostResponse> = {
  total_page_num: 1,
  post_responses: [
    {
      id: '10',
      title: '좋아요 TOP 공연',
      place: '세종문화회관',
      main_img: null,
      thumb_img: null,
      festival_view: 2200,
      festival_like: 999,
      is_free: 'N',
      major_code_name: '공연',
      gu_name: '종로구',
      sub_code_name: null,
    },
  ],
};

export const mockFestivalMostViewPage: PageResponse<FestivalMostResponse> = {
  total_page_num: 1,
  post_responses: [
    {
      id: '11',
      title: '조회 TOP 전시',
      place: 'DDP',
      main_img: null,
      thumb_img: null,
      festival_view: 9999,
      festival_like: 120,
      is_free: 'Y',
      major_code_name: '전시',
      gu_name: '중구',
      sub_code_name: null,
    },
  ],
};

export const mockFestivalDetail: FestivalDetailResponse = {
  id: '1',
  title: '서울 도심 야경 음악회',
  place: '서울광장',
  main_img: null,
  thumb_img: null,
  festival_view: 1234,
  festival_like: 210,
  major_code_name: '공연',
  gu_name: '중구',
  sub_code_name: null,
  strt_date: '2026-02-10',
  end_date: '2026-02-20',
  is_free: 'Y',
  content: '도심 야경과 함께 즐기는 라이브 공연입니다.',
  address: '서울특별시 중구 세종대로 110',
  phone: '02-000-0000',
  lat: 37.566535,
  lot: 126.9779692,
  org_link: 'https://example.com',
};

export const mockFestivalSearchPage: PageResponse<FestivalSearchResponse> = {
  total_page_num: 3,
  post_responses: [
    {
      id: '21',
      title: '검색 결과: 체험 클래스',
      place: '성수동 스튜디오',
      main_img: null,
      thumb_img: null,
      festival_view: 120,
      festival_like: 44,
      is_free: 'N',
      major_code_name: '교육/체험',
      gu_name: '성동구',
      sub_code_name: null,
      strt_date: '2026-02-12',
      end_date: '2026-02-12',
      address: '서울특별시 성동구 연무장길 00',
    },
  ],
};

export const mockSuggest: FestivalSuggestResponse = {
  suggestions: ['한강', '야경', '전시', '공연', '체험'],
};

export const mockNearbyPage: PageResponse<FestivalNearResponse> = {
  total_page_num: 2,
  post_responses: [
    {
      id: '31',
      title: '근처 축제 A',
      place: '서울시청 인근',
      main_img: null,
      thumb_img: null,
      festival_view: 12,
      festival_like: 2,
      major_code_name: '축제',
      gu_name: '중구',
      sub_code_name: null,
      strt_date: '2026-02-08',
      end_date: '2026-02-09',
      is_free: 'Y',
      content: null,
      address: '서울특별시 중구',
      phone: null,
      lat: 37.5665,
      lot: 126.978,
      org_link: null,
      distance_km: 0.8,
    },
  ],
};
