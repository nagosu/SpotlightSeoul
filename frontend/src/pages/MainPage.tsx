import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  EmptyState,
  ErrorState,
  FestivalCard,
  PageContainer,
  RankingCard,
  SectionHeader,
  Skeleton,
} from '@/components/ui';
import {
  useFestivalListQuery,
  useMostLikedFestivalsQuery,
  useMostViewedFestivalsQuery,
} from '@/hooks';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function MainPage() {
  const navigate = useNavigate();

  const {
    data: latestData,
    isLoading: latestLoading,
    isError: latestError,
    refetch: refetchLatest,
  } = useFestivalListQuery({
    sort: 'recent',
    status: 'ongoing',
    page: 0,
    size: 6,
  });

  const {
    data: likedData,
    isLoading: likeLoading,
    isError: likeError,
    refetch: refetchLike,
  } = useMostLikedFestivalsQuery({
    page: 0,
    size: 5,
  });

  const {
    data: viewedData,
    isLoading: viewLoading,
    isError: viewError,
    refetch: refetchView,
  } = useMostViewedFestivalsQuery({
    page: 0,
    size: 5,
  });

  const latestFestivals = useMemo(
    () => latestData?.post_responses ?? [],
    [latestData],
  );
  const likedFestivals = useMemo(
    () => likedData?.post_responses ?? [],
    [likedData],
  );
  const viewedFestivals = useMemo(
    () => viewedData?.post_responses ?? [],
    [viewedData],
  );

  return (
    <div className="min-h-screen bg-surface-1">
      <section className="bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-primary/70 text-white">
        <PageContainer className="py-10 md:py-14">
          <p className="font-LexendDeca text-xs font-bold tracking-[0.2em] text-white/80">
            SPOTLIGHT SEOUL
          </p>
          <h1 className="mt-2 font-LexendDeca text-3xl font-extrabold leading-tight md:text-4xl">
            서울의 문화행사를 한눈에
          </h1>
          <p className="text-white/85 mt-3 max-w-xl text-sm leading-6 md:text-base">
            검색과 탐색으로 지금 볼만한 행사를 빠르게 찾아보세요.
          </p>

          <div className="mt-6 max-w-xl space-y-3">
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className={cx(
                'w-full rounded-control border border-white/20 bg-white/10 px-4 py-3 text-left',
                'hover:bg-white/15 transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-primary',
              )}
              aria-label="축제 검색하러 이동"
            >
              <span className="text-white/85 text-sm md:text-base">
                어떤 축제를 찾고 계세요?
              </span>
            </button>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="ghost"
                size="lg"
                className="w-full border border-white/20 text-white hover:bg-white/10"
                onClick={() => navigate('/nearby')}
                ariaLabel="가까운 축제 보기"
              >
                가까운 축제 보기
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <main className="py-8 md:py-10">
        <PageContainer className="space-y-10">
          {/* Section A: 최신 업데이트 */}
          <section aria-labelledby="home-latest">
            <SectionHeader
              title="최신 업데이트"
              subtitle="지금 새로 올라온 행사를 확인해보세요."
              actionLabel="전체 보기"
              href="/explore"
            />

            <div className="mt-4">
              {latestLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-2 pr-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pr-0">
                  {Array.from({ length: 3 }, (_, idx) => (
                    <div
                      key={`latest-skeleton-${idx}`}
                      className="min-w-[260px] snap-start md:min-w-0"
                    >
                      <Skeleton variant="card" />
                    </div>
                  ))}
                </div>
              ) : null}

              {latestError ? (
                <ErrorState
                  title="데이터를 불러올 수 없습니다"
                  description="잠시 후 다시 시도해주세요."
                  onRetry={refetchLatest}
                />
              ) : null}

              {!latestLoading && !latestError && latestFestivals.length === 0 ? (
                <EmptyState
                  title="표시할 행사가 없습니다"
                  description="조건을 바꿔서 탐색해보세요."
                  primaryAction={{
                    label: '탐색으로 이동',
                    onClick: () => navigate('/explore'),
                  }}
                />
              ) : null}

              {!latestLoading && !latestError && latestFestivals.length > 0 ? (
                <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pr-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:pr-0">
                  {latestFestivals.map((festival) => (
                    <div
                      key={festival.id}
                      className="min-w-[260px] snap-start md:min-w-0"
                    >
                      <FestivalCard festival={festival} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {/* Section B: 좋아요 TOP */}
          <section aria-labelledby="home-like-top">
            <SectionHeader
              title="좋아요 TOP"
              subtitle="가장 많은 좋아요를 받은 행사"
              actionLabel="탐색으로 이동"
              href="/explore"
            />

            <div className="mt-4">
              {likeLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <Skeleton
                      key={`like-skeleton-${idx}`}
                      variant="listRow"
                      className="h-24"
                    />
                  ))}
                </div>
              ) : null}

              {likeError ? (
                <ErrorState
                  title="데이터를 불러올 수 없습니다"
                  description="잠시 후 다시 시도해주세요."
                  onRetry={refetchLike}
                />
              ) : null}

              {!likeLoading && !likeError && likedFestivals.length === 0 ? (
                <EmptyState
                  title="표시할 행사가 없습니다"
                  description="탐색에서 더 많은 행사를 찾아보세요."
                  primaryAction={{
                    label: '탐색으로 이동',
                    onClick: () => navigate('/explore'),
                  }}
                />
              ) : null}

              {!likeLoading && !likeError && likedFestivals.length > 0 ? (
                <div className="space-y-3">
                  {likedFestivals.map((festival, idx) => (
                    <RankingCard
                      key={festival.id}
                      festival={festival}
                      rank={idx + 1}
                      statLabel="좋아요"
                      statValue={festival.festival_like}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>

          {/* Section C: 조회 TOP */}
          <section aria-labelledby="home-view-top">
            <SectionHeader
              title="조회 TOP"
              subtitle="가장 많이 조회된 행사"
              actionLabel="탐색으로 이동"
              href="/explore"
            />

            <div className="mt-4">
              {viewLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }, (_, idx) => (
                    <Skeleton
                      key={`view-skeleton-${idx}`}
                      variant="listRow"
                      className="h-24"
                    />
                  ))}
                </div>
              ) : null}

              {viewError ? (
                <ErrorState
                  title="데이터를 불러올 수 없습니다"
                  description="잠시 후 다시 시도해주세요."
                  onRetry={refetchView}
                />
              ) : null}

              {!viewLoading && !viewError && viewedFestivals.length === 0 ? (
                <EmptyState
                  title="표시할 행사가 없습니다"
                  description="탐색에서 더 많은 행사를 찾아보세요."
                  primaryAction={{
                    label: '탐색으로 이동',
                    onClick: () => navigate('/explore'),
                  }}
                />
              ) : null}

              {!viewLoading && !viewError && viewedFestivals.length > 0 ? (
                <div className="space-y-3">
                  {viewedFestivals.map((festival, idx) => (
                    <RankingCard
                      key={festival.id}
                      festival={festival}
                      rank={idx + 1}
                      statLabel="조회"
                      statValue={festival.festival_view}
                      showCategory={false}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        </PageContainer>
      </main>

      {/* Bottom CTA */}
      <section className="bg-surface-1 py-10">
        <PageContainer>
          <div className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft md:flex md:items-center md:justify-between md:gap-6">
            <div className="min-w-0">
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                조건으로 축제를 찾아볼까요?
              </h2>
              <p className="mt-2 text-sm text-text-muted">
                날짜, 상태, 정렬 등 원하는 조건으로 탐색해보세요.
              </p>
            </div>

            <div className="mt-4 shrink-0 md:mt-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/explore')}
                ariaLabel="탐색 페이지로 이동"
              >
                조건으로 찾아보기
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}

export default MainPage;
