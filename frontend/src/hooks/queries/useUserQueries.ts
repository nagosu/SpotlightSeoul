import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import {
  getMyBookmarks,
  getUserById,
  type FestivalResponse,
  type PageResponse,
  type UserResponse,
} from '@/api';
import { queryKeys } from '@/lib/queryKeys';

type PageParams = {
  page?: number;
  size?: number;
};

export function useUserProfileQuery(
  userId: string,
  options?: Omit<UseQueryOptions<UserResponse>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.user.profile(userId).queryKey,
    queryFn: () => getUserById(userId),
    enabled: Boolean(userId) && (options?.enabled ?? true),
    ...options,
  });
}

export function useMyBookmarksQuery(
  params: PageParams = {},
  options?: Omit<
    UseQueryOptions<PageResponse<FestivalResponse>>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: queryKeys.user.bookmarks(params).queryKey,
    queryFn: () => getMyBookmarks(params),
    ...options,
  });
}

