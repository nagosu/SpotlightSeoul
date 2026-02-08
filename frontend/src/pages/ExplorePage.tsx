import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FestivalResponse, FestivalListParams } from '@/api/types';
import {
  EmptyState,
  ErrorState,
  FestivalCard,
  PageContainer,
  Skeleton,
} from '@/components/ui';
import Pagination from '@/components/ui/Pagination';
import FilterBar, { type ExploreFilters } from '@/components/explore/FilterBar';
import SearchBar from '@/components/explore/SearchBar';
import { mockExploreListPage, mockSuggest } from '@/mocks/festivals';

type PageStatus = 'loading' | 'error' | 'empty' | 'success';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function toDate(value: string | null | undefined) {
  if (!value) return null;
  const d = new Date(value);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(d.getTime())) return null;
  return d;
}

function todayYmd() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getStatusForFestival(
  festival: Pick<FestivalResponse, 'strt_date' | 'end_date'>,
  today: Date,
): FestivalListParams['status'] {
  const start = toDate(festival.strt_date ?? undefined);
  const end = toDate(festival.end_date ?? undefined) ?? start;
  if (!start || !end) return 'all';
  if (start.getTime() > today.getTime()) return 'upcoming';
  if (end.getTime() < today.getTime()) return 'ended';
  return 'ongoing';
}

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

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

function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<PageStatus>('loading');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const filters = useMemo<ExploreFilters>(() => {
    const q = searchParams.get('q') ?? '';
    const statusParam = parseEnum(
      searchParams.get('status'),
      ['all', 'upcoming', 'ongoing', 'ended'] as const,
      'all',
    );
    const sortParam = parseEnum(
      searchParams.get('sort'),
      ['recent', 'like', 'view', 'end_date'] as const,
      'recent',
    );
    const strtDate = searchParams.get('strtDate') ?? '';
    const endDate = searchParams.get('endDate') ?? '';
    return { q, status: statusParam, sort: sortParam, strtDate, endDate };
  }, [searchParams]);

  const requestedPage = useMemo(() => {
    const raw = searchParams.get('page');
    const n = raw ? Number(raw) : 1;
    if (!raw) return 1;
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(n) || !Number.isFinite(n)) return 1;
    return Math.max(1, Math.floor(n));
  }, [searchParams]);

  const allItems = mockExploreListPage.post_responses;
  const pageSize = 9;

  const filteredSorted = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const today = toDate(todayYmd()) ?? new Date();
    const rangeStart = toDate(filters.strtDate);
    const rangeEnd = toDate(filters.endDate);

    const filtered = allItems.filter((festival) => {
      if (q) {
        const title = (festival.title ?? '').toLowerCase();
        const place = (festival.place ?? '').toLowerCase();
        if (!title.includes(q) && !place.includes(q)) return false;
      }

      if (filters.status !== 'all') {
        const s = getStatusForFestival(festival, today);
        if (s !== filters.status) return false;
      }

      if (rangeStart || rangeEnd) {
        const start = toDate(festival.strt_date ?? undefined);
        const end = toDate(festival.end_date ?? undefined) ?? start;
        if (!start || !end) return false;
        if (rangeStart && end.getTime() < rangeStart.getTime()) return false;
        if (rangeEnd && start.getTime() > rangeEnd.getTime()) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (filters.sort === 'like') {
      sorted.sort((a, b) => b.festival_like - a.festival_like);
    } else if (filters.sort === 'view') {
      sorted.sort((a, b) => b.festival_view - a.festival_view);
    } else if (filters.sort === 'end_date') {
      sorted.sort((a, b) => {
        const ae =
          toDate(a.end_date ?? undefined)?.getTime() ??
          Number.POSITIVE_INFINITY;
        const be =
          toDate(b.end_date ?? undefined)?.getTime() ??
          Number.POSITIVE_INFINITY;
        return ae - be;
      });
    } else {
      // recent
      sorted.sort((a, b) => {
        const as = toDate(a.strt_date ?? undefined)?.getTime() ?? 0;
        const bs = toDate(b.strt_date ?? undefined)?.getTime() ?? 0;
        return bs - as;
      });
    }

    return sorted;
  }, [allItems, filters]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  }, [filteredSorted.length]);

  const currentPage = clamp(requestedPage, 1, totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSorted.slice(start, start + pageSize);
  }, [currentPage, filteredSorted]);

  const setParam = useCallback(
    (next: Partial<ExploreFilters> & { page?: number }) => {
      const sp = new URLSearchParams(searchParams);

      if (typeof next.page === 'number') {
        sp.set('page', String(next.page));
      }

      if (typeof next.q === 'string') {
        const v = next.q.trim();
        if (v) sp.set('q', v);
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

      setSearchParams(sp, { replace: false });
    },
    [searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: false });
  }, [setSearchParams]);

  const run = useCallback(() => {
    setStatus('loading');
    setErrorBanner(null);
    window.setTimeout(() => {
      // 퍼블리싱 단계: UI 상태 검증 목적의 간단 시뮬레이션
      const has = filteredSorted.length > 0;
      setStatus(has ? 'success' : 'empty');
    }, 500);
  }, [filteredSorted.length]);

  useEffect(() => {
    run();
  }, [run]);

  // URL page 보정 (유효 범위 밖이면 클램프하여 URL을 정리)
  useEffect(() => {
    if (currentPage !== requestedPage) {
      setParam({ page: currentPage });
    }
  }, [currentPage, requestedPage, setParam]);

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
            {status === 'success' ? `${filteredSorted.length}개` : null}
          </p>
        </div>

        <div className="mt-5 space-y-4">
          <SearchBar
            value={filters.q}
            suggestions={mockSuggest.suggestions}
            onChange={(v) => setParam({ q: v, page: 1 })}
            onSubmit={(v) => setParam({ q: v, page: 1 })}
            onSelectSuggestion={(v) => setParam({ q: v, page: 1 })}
          />

          <FilterBar
            filters={filters}
            onChange={(next) => {
              setParam({ ...next, page: 1 });
            }}
            onReset={() => {
              resetFilters();
            }}
          />

          {errorBanner ? (
            <div
              className="rounded-control border border-border-default bg-surface-0 px-4 py-3 text-sm text-text-strong shadow-soft"
              role="status"
            >
              {errorBanner}
            </div>
          ) : null}

          <section aria-label="탐색 결과" className="pt-2">
            {status === 'loading' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {skeletonKeys.map((k) => (
                  <Skeleton key={k} variant="card" />
                ))}
              </div>
            ) : null}

            {status === 'error' ? (
              <ErrorState
                title="결과를 불러올 수 없습니다"
                description="잠시 후 다시 시도해주세요."
                onRetry={() => {
                  setErrorBanner(
                    '일시적인 오류가 발생했습니다. 다시 시도해주세요.',
                  );
                  run();
                }}
              />
            ) : null}

            {status === 'empty' ? (
              <EmptyState
                title="검색 결과가 없습니다"
                description="조건을 바꾸거나 필터를 초기화해보세요."
                primaryAction={{
                  label: '필터 초기화',
                  onClick: resetFilters,
                }}
              />
            ) : null}

            {status === 'success' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pageItems.map((festival) => (
                    <FestivalCard key={festival.id} festival={festival} />
                  ))}
                </div>

                <div className={cx('pt-2')}>
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
