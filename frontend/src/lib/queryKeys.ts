import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import type {
  FestivalListParams,
  FestivalNearParams,
  FestivalSearchRequest,
  FestivalSuggestParams,
} from '@/api';

type PageParams = {
  page?: number;
  size?: number;
};

type FestivalCategoryParams = Omit<FestivalListParams, 'status' | 'sort'>;

export const queryKeys = createQueryKeyStore({
  festival: {
    list: (params: FestivalListParams = {}) => ({
      queryKey: [params],
    }),
    detail: (id: string) => ({
      queryKey: [id],
    }),
    suggest: (params: FestivalSuggestParams) => ({
      queryKey: [params],
    }),
    mostLiked: (params: PageParams = {}) => ({
      queryKey: [params],
    }),
    mostViewed: (params: PageParams = {}) => ({
      queryKey: [params],
    }),
    nearby: (params: FestivalNearParams) => ({
      queryKey: [params],
    }),
    search: (body: FestivalSearchRequest, params: PageParams = {}) => ({
      queryKey: [body, params],
    }),
    category: (params: FestivalCategoryParams = {}) => ({
      queryKey: [params],
    }),
  },
  user: {
    profile: (userId: string) => ({
      queryKey: [userId],
    }),
    bookmarks: (params: PageParams = {}) => ({
      queryKey: [params],
    }),
  },
});

