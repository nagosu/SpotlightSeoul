import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  getFestivalDetail,
  getFestivals,
  getFestivalsByCategory,
  getMostLikedFestivals,
  getMostViewedFestivals,
  getNearbyFestivals,
  getSuggestions,
  searchFestivals,
  type FestivalDetailResponse,
  type FestivalFilterResponse,
  type FestivalListParams,
  type FestivalMostResponse,
  type FestivalNearParams,
  type FestivalNearResponse,
  type FestivalResponse,
  type FestivalSearchRequest,
  type FestivalSearchResponse,
  type FestivalSuggestParams,
  type FestivalSuggestResponse,
  type PageResponse,
} from '@/api';
import { queryKeys } from '@/lib/queryKeys';

type PageParams = {
  page?: number;
  size?: number;
};

type FestivalCategoryParams = Omit<FestivalListParams, 'status' | 'sort'>;

export function useFestivalListQuery(
  params: FestivalListParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.list(params).queryKey,
    queryFn: () => getFestivals(params),
    ...options,
  });
}

export function useFestivalDetailQuery(
  id: string,
  options?: Omit<
    UseQueryOptions<FestivalDetailResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.detail(id).queryKey,
    queryFn: () => getFestivalDetail(id),
    enabled: Boolean(id) && (options?.enabled ?? true),
    ...options,
  });
}

export function useFestivalSuggestQuery(
  params: FestivalSuggestParams,
  options?: Omit<
    UseQueryOptions<FestivalSuggestResponse>,
    'queryKey' | 'queryFn'
  >,
) {
  const q = params?.q ?? '';
  const defaultEnabled = q.trim().length >= 2;

  return useQuery({
    queryKey: queryKeys.festival.suggest(params).queryKey,
    queryFn: () => getSuggestions(params),
    enabled: defaultEnabled && (options?.enabled ?? true),
    ...options,
  });
}

export function useMostLikedFestivalsQuery(
  params: PageParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalMostResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.mostLiked(params).queryKey,
    queryFn: () => getMostLikedFestivals(params),
    ...options,
  });
}

export function useMostViewedFestivalsQuery(
  params: PageParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalMostResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.mostViewed(params).queryKey,
    queryFn: () => getMostViewedFestivals(params),
    ...options,
  });
}

export function useNearbyFestivalsQuery(
  params: FestivalNearParams,
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalNearResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.nearby(params).queryKey,
    queryFn: () => getNearbyFestivals(params),
    ...options,
  });
}

export function useFestivalSearchQuery(
  body: FestivalSearchRequest,
  params: PageParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalSearchResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.search(body, params).queryKey,
    queryFn: () => searchFestivals(body, params),
    ...options,
  });
}

export function useFestivalCategoryQuery(
  params: FestivalCategoryParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalFilterResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.festival.category(params).queryKey,
    queryFn: () => getFestivalsByCategory(params),
    ...options,
  });
}

