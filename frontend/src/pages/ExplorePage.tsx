import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ApiError, FestivalListParams } from '@/api';
import FilterBar, { type ExploreFilters } from '@/components/explore/FilterBar';
import SearchBar from '@/components/explore/SearchBar';
import {
  EmptyState,
  ErrorState,
  FestivalCard,
  PageContainer,
  Skeleton,
} from '@/components/ui';
import Pagination from '@/components/ui/Pagination';
import {
  useDebouncedValue,
  useFestivalListQuery,
  useFestivalSuggestQuery,
} from '@/hooks';

const PAGE_SIZE = 12;

function parseEnum<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T,
): T {
  if (!value) return fallback;
  return (allowed as readonly string[]).includes(value)
    ? (value as T)
    : fallback;
}

function parsePositivePage(value: string | null): number {
  if (!value) return 1;
  const page = Number(value);
  if (!Number.isFinite(page)) return 1;
  return Math.max(1, Math.floor(page));
}

function getVisibleTotalCount(params: {
  totalPages: number;
  currentPage: number;
  pageSize: number;
  itemCount: number;
  totalCount?: number;
}): number {
  const { totalPages, currentPage, pageSize, itemCount, totalCount } = params;
  if (typeof totalCount === 'number' && Number.isFinite(totalCount)) {
    return Math.max(0, totalCount);
  }
  if (totalPages <= 0) return 0;
  if (currentPage >= totalPages) {
    return (totalPages - 1) * pageSize + itemCount;
  }
  return totalPages * pageSize;
}

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ExploreFilters>(() => {
    const q = searchParams.get('q') ?? '';
    const status = parseEnum(
      searchParams.get('status'),
      ['all', 'upcoming', 'ongoing', 'ended'] as const,
      'all',
    );
    const sort = parseEnum(
      searchParams.get('sort'),
      ['recent', 'like', 'view', 'end_date'] as const,
      'recent',
    );
    const strtDate = searchParams.get('strtDate') ?? '';
    const endDate = searchParams.get('endDate') ?? '';
    return { q, status, sort, strtDate, endDate };
  }, [searchParams]);

  const requestedPage = useMemo(
    () => parsePositivePage(searchParams.get('page')),
    [searchParams],
  );

  const [inputValue, setInputValue] = useState(filters.q);
  const debouncedValue = useDebouncedValue(inputValue, 300);

  useEffect(() => {
    setInputValue(filters.q);
  }, [filters.q]);

  const apiParams = useMemo<FestivalListParams>(() => {
    const params: FestivalListParams = {
      page: requestedPage - 1,
      size: PAGE_SIZE,
    };

    const title = filters.q.trim();
    if (title) params.title = title;
    if (filters.status !== 'all') params.status = filters.status;
    if (filters.sort !== 'recent') params.sort = filters.sort;
    if (filters.strtDate) params.strtDate = filters.strtDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return params;
  }, [filters, requestedPage]);

  const { data, isLoading, isError, error, refetch, isSuccess } =
    useFestivalListQuery(apiParams);
  const suggestQuery = useFestivalSuggestQuery({
    q: debouncedValue,
    limit: 8,
  });

  const items = data?.post_responses ?? [];
  const totalPages = Math.max(1, data?.total_page_num ?? 1);
  const currentPage = Math.min(requestedPage, totalPages);
  const isEmpty = !isLoading && !isError && items.length === 0;

  const serverTotalCount = (
    data as (typeof data & { total_count?: number }) | undefined
  )?.total_count;
  const totalCount = getVisibleTotalCount({
    totalPages: data?.total_page_num ?? 0,
    currentPage,
    pageSize: PAGE_SIZE,
    itemCount: items.length,
    totalCount: serverTotalCount,
  });

  const suggestions = suggestQuery.data?.suggestions ?? [];

  const setParam = useCallback(
    (
      next: Partial<ExploreFilters> & { page?: number },
      options?: { replace?: boolean },
    ) => {
      const sp = new URLSearchParams(searchParams);

      if (typeof next.page === 'number') {
        if (next.page <= 1) sp.delete('page');
        else sp.set('page', String(next.page));
      }

      if (typeof next.q === 'string') {
        const value = next.q.trim();
        if (value) sp.set('q', value);
        else sp.delete('q');
      }

      if (next.status) {
        if (next.status === 'all') sp.delete('status');
        else sp.set('status', next.status);
      }

      if (next.sort) {
        if (next.sort === 'recent') sp.delete('sort');
        else sp.set('sort', next.sort);
      }

      if (typeof next.strtDate === 'string') {
        if (next.strtDate) sp.set('strtDate', next.strtDate);
        else sp.delete('strtDate');
      }

      if (typeof next.endDate === 'string') {
        if (next.endDate) sp.set('endDate', next.endDate);
        else sp.delete('endDate');
      }

      setSearchParams(sp, { replace: options?.replace ?? false });
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
    setInputValue('');
  }, [setSearchParams]);

  useEffect(() => {
    if (!isSuccess) return;
    if (requestedPage > totalPages) {
      setParam({ page: totalPages }, { replace: true });
    }
  }, [isSuccess, requestedPage, totalPages, setParam]);

  const skeletonKeys = useMemo(
    () => Array.from({ length: 6 }, (_, i) => `explore-skel-${i + 1}`),
    [],
  );

  return (
    <div className="min-h-screen bg-surface-1">
      <PageContainer className="py-6 md:py-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-LexendDeca text-2xl font-extrabold text-text-strong md:text-3xl">
              탐색
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              검색과 필터로 원하는 행사를 빠르게 찾아보세요.
            </p>
          </div>
          <p
            className="hidden text-sm text-text-muted md:block"
            aria-label="검색 결과 수"
          >
            {isSuccess && !isError ? `${totalCount}개` : null}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <SearchBar
            value={inputValue}
            suggestions={suggestions}
            isLoading={suggestQuery.isFetching}
            onChange={(value) => setInputValue(value)}
            onSubmit={(value) => {
              const next = value.trim();
              setInputValue(next);
              setParam({ q: next, page: 1 });
            }}
            onSelectSuggestion={(value) => {
              setInputValue(value);
              setParam({ q: value, page: 1 });
            }}
          />

          <FilterBar
            filters={filters}
            onChange={(next) => {
              setParam({ ...next, page: 1 });
            }}
            onReset={resetFilters}
          />

          <section aria-label="탐색 결과" className="pt-2">
            {isLoading ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skeletonKeys.map((key) => (
                  <Skeleton key={key} variant="card" />
                ))}
              </div>
            ) : null}

            {isError ? (
              <ErrorState
                title="결과를 불러올 수 없습니다"
                description={
                  (error as unknown as ApiError | null)?.message ??
                  '잠시 후 다시 시도해주세요.'
                }
                onRetry={() => {
                  refetch();
                }}
              />
            ) : null}

            {isEmpty ? (
              <EmptyState
                title="검색 결과가 없습니다"
                description="조건을 바꾸거나 필터를 초기화해보세요."
                primaryAction={{
                  label: '필터 초기화',
                  onClick: resetFilters,
                }}
              />
            ) : null}

            {!isLoading && !isError && !isEmpty ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((festival) => (
                    <FestivalCard key={festival.id} festival={festival} />
                  ))}
                </div>

                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setParam({ page });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </PageContainer>
    </div>
  );
}

export default ExplorePage;
