import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  likeFestival,
  toggleFestivalBookmark,
  toggleFestivalLike,
  type FestivalBookmarkToggleResponse,
  type FestivalLikeResponse,
  type FestivalLikeToggleResponse,
} from '@/api';
import { queryKeys } from '@/lib/queryKeys';

export function useToggleFestivalLikeMutation(
  options?: UseMutationOptions<FestivalLikeToggleResponse, unknown, string>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => toggleFestivalLike(festivalId),
    ...rest,
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.festival._def });
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

export function useToggleFestivalBookmarkMutation(
  options?: UseMutationOptions<FestivalBookmarkToggleResponse, unknown, string>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => toggleFestivalBookmark(festivalId),
    ...rest,
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.user._def });
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

export function useLikeFestivalMutation(
  options?: UseMutationOptions<FestivalLikeResponse, unknown, string>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => likeFestival(festivalId),
    ...rest,
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.festival._def });
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

