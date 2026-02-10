import { apiClient } from './client';
import type { PageResponse } from './types/common';
import type {
  FestivalBookmarkToggleResponse,
  FestivalDetailResponse,
  FestivalFilterResponse,
  FestivalLikeResponse,
  FestivalLikeToggleResponse,
  FestivalListParams,
  FestivalMostResponse,
  FestivalNearParams,
  FestivalNearResponse,
  FestivalResponse,
  FestivalSearchRequest,
  FestivalSearchResponse,
  FestivalSuggestParams,
  FestivalSuggestResponse,
} from './types/festival';

type FestivalCategoryParams = Omit<FestivalListParams, 'status' | 'sort'>;

/**
 * 축제 리스트(통합) 조회
 */
export async function getFestivals(
  params?: FestivalListParams,
): Promise<PageResponse<FestivalResponse>> {
  const response = await apiClient.get<PageResponse<FestivalResponse>>(
    '/api/v1/festivals',
    { params },
  );
  return response.data;
}

/**
 * 축제 타이틀 검색
 */
export async function searchFestivals(
  body: FestivalSearchRequest,
  params?: Pick<FestivalListParams, 'page' | 'size'>,
): Promise<PageResponse<FestivalSearchResponse>> {
  const response = await apiClient.post<PageResponse<FestivalSearchResponse>>(
    '/api/v1/festivals',
    body,
    { params },
  );
  return response.data;
}

/**
 * 축제 자동완성 검색어 조회
 */
export async function getSuggestions(
  params: FestivalSuggestParams,
): Promise<FestivalSuggestResponse> {
  const response = await apiClient.get<FestivalSuggestResponse>(
    '/api/v1/festivals/suggest',
    { params },
  );
  return response.data;
}

/**
 * 축제 필터 검색
 */
export async function getFestivalsByCategory(
  params?: FestivalCategoryParams,
): Promise<PageResponse<FestivalFilterResponse>> {
  const response = await apiClient.get<PageResponse<FestivalFilterResponse>>(
    '/api/v1/festivals/category',
    { params },
  );
  return response.data;
}

/**
 * 내 주변 축제 조회(거리순)
 */
export async function getNearbyFestivals(
  params: FestivalNearParams,
): Promise<PageResponse<FestivalNearResponse>> {
  const response = await apiClient.get<PageResponse<FestivalNearResponse>>(
    '/api/v1/festivals/near',
    { params },
  );
  return response.data;
}

/**
 * 축제 상세 조회(조회수 +1)
 */
export async function getFestivalDetail(
  id: string,
): Promise<FestivalDetailResponse> {
  const response = await apiClient.get<FestivalDetailResponse>(
    `/api/v1/festivals/${id}`,
    { withAuthToken: true },
  );
  return response.data;
}

/**
 * 축제 좋아요 토글(로그인 필요)
 */
export async function toggleFestivalLike(
  id: string,
): Promise<FestivalLikeToggleResponse> {
  const response = await apiClient.put<FestivalLikeToggleResponse>(
    `/api/v1/festivals/${id}/like`,
    undefined,
    { withAuthToken: true },
  );
  return response.data;
}

/**
 * 축제 북마크 토글(로그인 필요)
 */
export async function toggleFestivalBookmark(
  id: string,
): Promise<FestivalBookmarkToggleResponse> {
  const response = await apiClient.put<FestivalBookmarkToggleResponse>(
    `/api/v1/festivals/${id}/bookmark`,
    undefined,
    { withAuthToken: true },
  );
  return response.data;
}

/**
 * 축제 좋아요 +1 (비로그인용 단발 액션)
 */
export async function likeFestival(id: string): Promise<FestivalLikeResponse> {
  const response = await apiClient.put<FestivalLikeResponse>(
    `/api/v1/festivals/likes/${id}`,
  );
  return response.data;
}

/**
 * 좋아요 TOP 리스트
 */
export async function getMostLikedFestivals(params?: {
  likes?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<FestivalMostResponse>> {
  const response = await apiClient.get<PageResponse<FestivalMostResponse>>(
    '/api/v1/festivals/likes',
    { params },
  );
  return response.data;
}

/**
 * 조회수 TOP 리스트
 */
export async function getMostViewedFestivals(params?: {
  views?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<FestivalMostResponse>> {
  const response = await apiClient.get<PageResponse<FestivalMostResponse>>(
    '/api/v1/festivals/views',
    { params },
  );
  return response.data;
}
