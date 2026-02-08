import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  EmptyState,
  ErrorState,
  FilterChip,
  NearbyFestivalCard,
  PageContainer,
  Skeleton,
} from '@/components/ui';
import type { FestivalNearResponse } from '@/api';
import { mockNearbyPage } from '@/mocks/festivals';

type GeoStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';
type ListStatus = 'loading' | 'success' | 'empty' | 'error';

type Coords = { lat: number; lot: number };

const DEFAULT_COORDS: Coords = { lat: 37.5665, lot: 126.978 };
const PAGE_SIZE = 5;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

function getFestivalStatus(
  now: Date,
  festival: Pick<FestivalNearResponse, 'strt_date' | 'end_date'>,
): 'upcoming' | 'ongoing' | 'ended' {
  const { strt_date: strt, end_date: end } = festival;
  if (!strt || !end) return 'ongoing';

  const start = new Date(strt);
  const finish = new Date(end);
  if (Number.isNaN(start.getTime()) || Number.isNaN(finish.getTime()))
    return 'ongoing';

  if (now < start) return 'upcoming';
  if (now > finish) return 'ended';
  return 'ongoing';
}

function LocationIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.3a2 2 0 0 1 3.4 0l7.4 12.7A2 2 0 0 1 19.4 20H4.6a2 2 0 0 1-1.7-3l7.4-12.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function NearbyPage() {
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [listStatus, setListStatus] = useState<ListStatus>('loading');
  const [coords, setCoords] = useState<Coords | null>(null);
  const [usingDefaultLocation, setUsingDefaultLocation] = useState(false);

  const [radiusKm, setRadiusKm] = useState(5);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'upcoming' | 'ongoing' | 'ended'
  >('all');

  const [page, setPage] = useState(0);
  const [items, setItems] = useState<FestivalNearResponse[]>([]);
  const [isMoreLoading, setIsMoreLoading] = useState(false);

  const now = useMemo(() => new Date(), []);

  const filteredSortedAll = useMemo(() => {
    const all = mockNearbyPage.post_responses;
    const filtered = all
      .filter((f) => f.distance_km <= radiusKm)
      .filter((f) => {
        if (statusFilter === 'all') return true;
        return getFestivalStatus(now, f) === statusFilter;
      })
      .slice()
      .sort((a, b) => a.distance_km - b.distance_km);
    return filtered;
  }, [now, radiusKm, statusFilter]);

  const totalPages = useMemo(() => {
    const computed = Math.max(
      1,
      Math.ceil(filteredSortedAll.length / PAGE_SIZE),
    );
    return Math.min(mockNearbyPage.total_page_num, computed);
  }, [filteredSortedAll.length]);

  const canLoadMore = listStatus === 'success' && page + 1 < totalPages;

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoStatus('error');
      return;
    }

    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUsingDefaultLocation(false);
        setCoords({
          lat: pos.coords.latitude,
          lot: pos.coords.longitude,
        });
        setGeoStatus('granted');
      },
      (err) => {
        if (err.code === 1) {
          setGeoStatus('denied');
          return;
        }
        setGeoStatus('error');
      },
      {
        enableHighAccuracy: false,
        timeout: 10_000,
        maximumAge: 30_000,
      },
    );
  }, []);

  const useDefaultLocation = useCallback(() => {
    setUsingDefaultLocation(true);
    setCoords(DEFAULT_COORDS);
    setGeoStatus('granted');
  }, []);

  const runList = useCallback(async () => {
    setListStatus('loading');
    setPage(0);
    setItems([]);
    setIsMoreLoading(false);

    try {
      // 오프라인 환경에서 에러 상태 UI를 검증할 수 있도록 처리합니다.
      if ('onLine' in navigator && !navigator.onLine) {
        throw new Error('offline');
      }

      await delay(500);
      const firstPage = filteredSortedAll.slice(0, PAGE_SIZE);
      setItems(firstPage);
      setListStatus(firstPage.length > 0 ? 'success' : 'empty');
    } catch {
      setListStatus('error');
    }
  }, [filteredSortedAll]);

  useEffect(() => {
    if (geoStatus !== 'granted' || !coords) return;
    runList();
    // coords는 퍼블리싱 단계에서 UI 상태 확인용(데이터는 mock).
  }, [coords, geoStatus, radiusKm, runList, statusFilter]);

  const loadMore = useCallback(async () => {
    if (!canLoadMore || isMoreLoading) return;

    setIsMoreLoading(true);
    try {
      if ('onLine' in navigator && !navigator.onLine) {
        throw new Error('offline');
      }

      await delay(500);
      const nextPage = page + 1;
      const nextItems = filteredSortedAll.slice(0, (nextPage + 1) * PAGE_SIZE);
      setPage(nextPage);
      setItems(nextItems);
    } catch {
      setListStatus('error');
    } finally {
      setIsMoreLoading(false);
    }
  }, [canLoadMore, filteredSortedAll, isMoreLoading, page]);

  const skeletonKeys = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `nearby-skel-${i + 1}`),
    [],
  );

  const locationLabel = usingDefaultLocation
    ? '기본 위치(서울시청)'
    : '현재 위치';

  return (
    <div className="min-h-screen bg-surface-1">
      <PageContainer className="py-6 md:py-8">
        <div className="min-w-0">
          <h1 className="font-LexendDeca text-2xl font-extrabold text-text-strong md:text-3xl">
            내 주변
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            위치 기반으로 가까운 축제를 빠르게 찾아보세요.
          </p>
        </div>

        {/* Geo gate */}
        {geoStatus === 'idle' || geoStatus === 'requesting' ? (
          <div className="mt-6">
            <div className="rounded-card border border-border-default bg-surface-0 p-6 text-center shadow-soft">
              <div className="mx-auto mb-3 w-fit text-text-muted">
                <LocationIcon />
              </div>
              <h2 className="font-LexendDeca text-base font-bold text-text-strong">
                가까운 축제를 찾으려면 위치 정보가 필요해요
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                위치 권한은 주변 축제를 정렬하고 추천하는 데 사용됩니다.
              </p>
              <div className="mt-4 flex flex-col items-center gap-2">
                <Button
                  size="lg"
                  loading={geoStatus === 'requesting'}
                  onClick={requestLocation}
                  ariaLabel="위치 허용하기"
                >
                  위치 허용하기
                </Button>
                <button
                  type="button"
                  onClick={useDefaultLocation}
                  className={cx(
                    'text-sm text-text-muted underline underline-offset-4 transition',
                    'hover:text-text-strong',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                  )}
                >
                  위치 없이 둘러보기
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {geoStatus === 'denied' ? (
          <div className="mt-6">
            <div className="rounded-card border border-border-default bg-surface-0 p-6 text-center shadow-soft">
              <div className="mx-auto mb-3 w-fit text-text-muted">
                <WarningIcon />
              </div>
              <h2 className="font-LexendDeca text-base font-bold text-text-strong">
                위치 정보를 사용할 수 없어요
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                브라우저 설정에서 위치 권한을 허용할 수 있어요.
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={useDefaultLocation}
                  ariaLabel="기본 위치로 보기"
                >
                  기본 위치로 보기
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {geoStatus === 'error' ? (
          <div className="mt-6 space-y-3">
            <ErrorState
              title="위치 정보를 확인할 수 없습니다"
              description="잠시 후 다시 시도하거나 기본 위치로 둘러보세요."
              onRetry={requestLocation}
              icon={<WarningIcon />}
            />
            <div className="flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={useDefaultLocation}
                ariaLabel="기본 위치로 보기"
              >
                기본 위치로 보기
              </Button>
            </div>
          </div>
        ) : null}

        {/* Granted */}
        {geoStatus === 'granted' && coords ? (
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-border-default bg-surface-0 px-3 py-2 text-sm text-text-strong shadow-soft"
                aria-label="현재 위치 상태"
              >
                <span className="text-text-muted">
                  <LocationIcon />
                </span>
                <span className="font-semibold">{locationLabel}</span>
              </div>
              <p className="text-xs text-text-muted" aria-label="현재 좌표">
                {coords.lat.toFixed(4)}, {coords.lot.toFixed(4)}
              </p>
            </div>

            {/* Filters */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {([1, 3, 5, 10] as const).map((km) => (
                  <FilterChip
                    key={`r-${km}`}
                    label={`${km}km`}
                    selected={radiusKm === km}
                    onClick={() => setRadiusKm(km)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(
                  [
                    { id: 'all', label: '전체' },
                    { id: 'upcoming', label: '예정' },
                    { id: 'ongoing', label: '진행 중' },
                    { id: 'ended', label: '종료' },
                  ] as const
                ).map((s) => (
                  <FilterChip
                    key={`s-${s.id}`}
                    label={s.label}
                    selected={statusFilter === s.id}
                    onClick={() => setStatusFilter(s.id)}
                  />
                ))}
              </div>
            </div>

            {/* Result */}
            <section aria-label="내 주변 결과" className="pt-2">
              {listStatus === 'loading' ? (
                <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                  {skeletonKeys.map((k) => (
                    <Skeleton
                      key={k}
                      variant="listRow"
                      className="h-24 rounded-card md:h-48"
                    />
                  ))}
                </div>
              ) : null}

              {listStatus === 'error' ? (
                <ErrorState
                  title="결과를 불러올 수 없습니다"
                  description="네트워크 상태를 확인한 뒤 다시 시도해주세요."
                  onRetry={() => {
                    runList();
                  }}
                />
              ) : null}

              {listStatus === 'empty' ? (
                <EmptyState
                  title="주변에 축제가 없어요"
                  description="반경을 넓히거나 상태 필터를 바꿔보세요."
                  primaryAction={{
                    label: radiusKm < 10 ? '반경 10km로 보기' : '전체 보기',
                    onClick: () => {
                      if (radiusKm < 10) setRadiusKm(10);
                      else setStatusFilter('all');
                    },
                  }}
                />
              ) : null}

              {listStatus === 'success' ? (
                <div className="space-y-4">
                  <p
                    className="text-sm text-text-muted"
                    aria-label="검색 결과 수"
                  >
                    {filteredSortedAll.length}개의 축제를 찾았어요
                  </p>

                  <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                    {items.map((festival) => (
                      <NearbyFestivalCard
                        key={festival.id}
                        festival={festival}
                      />
                    ))}
                  </div>

                  {canLoadMore ? (
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="secondary"
                        size="md"
                        loading={isMoreLoading}
                        onClick={loadMore}
                        ariaLabel="더 보기"
                      >
                        더 보기
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
      </PageContainer>
    </div>
  );
}

export default NearbyPage;
