import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  likeFestival,
  toggleFestivalBookmark,
  toggleFestivalLike,
  type FestivalDetailResponse,
  type FestivalBookmarkToggleResponse,
  type FestivalLikeResponse,
  type FestivalLikeToggleResponse,
} from '@/api';
import { queryKeys } from '@/lib/queryKeys';

type FestivalDetailMutationContext = {
  previousDetail?: FestivalDetailResponse;
};

export function useToggleFestivalLikeMutation(
  options?: UseMutationOptions<
    FestivalLikeToggleResponse,
    unknown,
    string,
    FestivalDetailMutationContext
  >,
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSettled, onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => toggleFestivalLike(festivalId),
    ...rest,
    onMutate: async (festivalId, mutation) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });

      const previousDetail = queryClient.getQueryData<FestivalDetailResponse>(
        queryKeys.festival.detail(festivalId).queryKey,
      );

      if (previousDetail) {
        const nextLiked = !(previousDetail.liked ?? false);
        const nextLikeCount = Math.max(
          0,
          previousDetail.festival_like + (nextLiked ? 1 : -1),
        );

        queryClient.setQueryData<FestivalDetailResponse>(
          queryKeys.festival.detail(festivalId).queryKey,
          {
            ...previousDetail,
            liked: nextLiked,
            festival_like: nextLikeCount,
          },
        );
      }

      const userContext = await onMutate?.(festivalId, mutation);
      return {
        previousDetail: userContext?.previousDetail ?? previousDetail,
      };
    },
    onError: async (error, festivalId, ctx, mutation) => {
      if (ctx?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.festival.detail(festivalId).queryKey,
          ctx.previousDetail,
        );
      }
      await onError?.(error, festivalId, ctx, mutation);
    },
    onSettled: async (data, error, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.festival._def });
      await onSettled?.(data, error, festivalId, ctx, mutation);
    },
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

export function useToggleFestivalBookmarkMutation(
  options?: UseMutationOptions<
    FestivalBookmarkToggleResponse,
    unknown,
    string,
    FestivalDetailMutationContext
  >,
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSettled, onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => toggleFestivalBookmark(festivalId),
    ...rest,
    onMutate: async (festivalId, mutation) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });

      const previousDetail = queryClient.getQueryData<FestivalDetailResponse>(
        queryKeys.festival.detail(festivalId).queryKey,
      );

      if (previousDetail) {
        queryClient.setQueryData<FestivalDetailResponse>(
          queryKeys.festival.detail(festivalId).queryKey,
          {
            ...previousDetail,
            bookmarked: !(previousDetail.bookmarked ?? false),
          },
        );
      }

      const userContext = await onMutate?.(festivalId, mutation);
      return {
        previousDetail: userContext?.previousDetail ?? previousDetail,
      };
    },
    onError: async (error, festivalId, ctx, mutation) => {
      if (ctx?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.festival.detail(festivalId).queryKey,
          ctx.previousDetail,
        );
      }
      await onError?.(error, festivalId, ctx, mutation);
    },
    onSettled: async (data, error, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.user._def });
      await onSettled?.(data, error, festivalId, ctx, mutation);
    },
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

export function useLikeFestivalMutation(
  options?: UseMutationOptions<
    FestivalLikeResponse,
    unknown,
    string,
    FestivalDetailMutationContext
  >,
) {
  const queryClient = useQueryClient();
  const { onMutate, onError, onSettled, onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (festivalId: string) => likeFestival(festivalId),
    ...rest,
    onMutate: async (festivalId, mutation) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });

      const previousDetail = queryClient.getQueryData<FestivalDetailResponse>(
        queryKeys.festival.detail(festivalId).queryKey,
      );

      if (previousDetail) {
        queryClient.setQueryData<FestivalDetailResponse>(
          queryKeys.festival.detail(festivalId).queryKey,
          {
            ...previousDetail,
            festival_like: previousDetail.festival_like + 1,
            liked: true,
          },
        );
      }

      const userContext = await onMutate?.(festivalId, mutation);
      return {
        previousDetail: userContext?.previousDetail ?? previousDetail,
      };
    },
    onError: async (error, festivalId, ctx, mutation) => {
      if (ctx?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.festival.detail(festivalId).queryKey,
          ctx.previousDetail,
        );
      }
      await onError?.(error, festivalId, ctx, mutation);
    },
    onSettled: async (data, error, festivalId, ctx, mutation) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.festival.detail(festivalId).queryKey,
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.festival._def });
      await onSettled?.(data, error, festivalId, ctx, mutation);
    },
    onSuccess: async (data, festivalId, ctx, mutation) => {
      await onSuccess?.(data, festivalId, ctx, mutation);
    },
  });
}

