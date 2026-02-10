import { useCallback, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ApiError } from '@/api';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  PageContainer,
  Skeleton,
  useToast,
} from '@/components/ui';
import {
  useFestivalDetailQuery,
  useLikeFestivalMutation,
  useToggleFestivalBookmarkMutation,
  useToggleFestivalLikeMutation,
} from '@/hooks';
import { useAuthStore } from '@/stores/useAuthStore';
type TabKey = 'info' | 'content' | 'map';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatDateRange(start: string | null, end: string | null) {
  if (!start && !end) return '일정 미정';
  if (start && !end) return start;
  if (!start && end) return end;
  return `${start} ~ ${end}`;
}

function getFreeLabel(isFree: string | null) {
  if (isFree === 'Y') return '무료';
  if (isFree === 'N') return '유료';
  return null;
}

function safeTitle(value: string | null) {
  return value?.trim() ? value : '제목 정보가 없습니다';
}

function safeText(value: string | null, fallback: string) {
  return value?.trim() ? value : fallback;
}

function Icon({
  name,
  filled = false,
  className,
}: {
  name: 'arrowLeft' | 'share' | 'heart' | 'bookmark' | 'link';
  filled?: boolean;
  className?: string;
}) {
  const common = cx('h-5 w-5', className);

  switch (name) {
    case 'arrowLeft':
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'share':
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M16 8a3 3 0 10-2.83-4H13a3 3 0 003 3zM6 14a3 3 0 103 3 3 3 0 00-3-3zm0-4a3 3 0 103-3 3 3 0 00-3 3zm12 4l-8.2-4.1M9.8 14.1L18 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'heart':
      return filled ? (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M12 21s-7-4.4-9.5-8.4C.4 9.2 2.4 5.9 6 5.2c2-.4 3.5.5 4.5 1.7 1-1.2 2.5-2.1 4.5-1.7 3.6.7 5.6 4 3.5 7.4C19 16.6 12 21 12 21z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 21s-7-4.4-9.5-8.4C.4 9.2 2.4 5.9 6 5.2c2-.4 3.5.5 4.5 1.7 1-1.2 2.5-2.1 4.5-1.7 3.6.7 5.6 4 3.5 7.4C19 16.6 12 21 12 21z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'bookmark':
      return filled ? (
        <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
          <path
            d="M7 3h10a1 1 0 011 1v17l-6-3-6 3V4a1 1 0 011-1z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M7 3h10a1 1 0 011 1v17l-6-3-6 3V4a1 1 0 011-1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'link':
      return (
        <svg
          viewBox="0 0 24 24"
          className={common}
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 13a5 5 0 007.07 0l1.41-1.41a5 5 0 10-7.07-7.07L10 4.86"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 11a5 5 0 00-7.07 0L5.52 12.4a5 5 0 107.07 7.07L14 19.14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-surface-1">
      <section className="relative overflow-hidden">
        <div className="h-[260px] w-full bg-gradient-to-br from-brand-primary/70 via-brand-primary/60 to-brand-primary/40 md:h-[360px]" />
        <div className="absolute inset-x-0 bottom-0">
          <PageContainer className="pb-5 md:pb-6">
            <div className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft md:p-6">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-7 w-3/4" />
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                <Skeleton className="h-12 w-full rounded-control" />
                <Skeleton className="h-12 w-full rounded-control" />
                <Skeleton className="h-12 w-full rounded-control md:col-span-1" />
              </div>
            </div>
          </PageContainer>
        </div>
      </section>

      <main className="py-8 md:py-10">
        <PageContainer className="space-y-8">
          <section className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft md:p-6">
            <Skeleton className="h-5 w-24" />
            <div className="mt-4 space-y-3">
              <Skeleton />
              <Skeleton />
              <Skeleton className="w-2/3" />
            </div>
          </section>
          <section className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft md:p-6">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="mt-4 h-48 w-full rounded-card" />
          </section>
        </PageContainer>
      </main>
    </div>
  );
}

function DetailMapPlaceholder({
  address,
}: {
  address: string | null;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">
        {safeText(address, '주소 정보가 없습니다')}
      </p>
      <div className="flex h-44 items-center justify-center rounded-card border border-border-default bg-surface-2 text-sm font-semibold text-text-muted">
        지도는 퍼블리싱 단계에서 플레이스홀더로 제공됩니다
      </div>
    </div>
  );
}

function DetailActionBar({
  likeCount,
  liked,
  bookmarked,
  likePending,
  bookmarkPending,
  onToggleLike,
  onToggleBookmark,
  orgLink,
  variant,
}: {
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
  likePending: boolean;
  bookmarkPending: boolean;
  onToggleLike: () => void;
  onToggleBookmark: () => void;
  orgLink: string | null;
  variant: 'mobileSticky' | 'desktopInline';
}) {
  const containerClass =
    variant === 'mobileSticky'
      ? 'fixed inset-x-0 bottom-0 z-[60] border-t border-border-default bg-surface-0/95 backdrop-blur supports-[backdrop-filter]:bg-surface-0/75 md:hidden'
      : 'hidden md:block';

  return (
    <div className={containerClass}>
      <PageContainer
        className={cx(
          'py-3',
          variant === 'desktopInline' ? 'px-0 py-0' : null,
        )}
      >
        <div
          className={cx(
            'flex items-center gap-2',
            variant === 'desktopInline'
              ? 'rounded-card border border-border-default bg-surface-0 p-4 shadow-soft'
              : null,
          )}
        >
          <button
            type="button"
            onClick={onToggleLike}
            disabled={likePending}
            className={cx(
              'flex flex-1 items-center justify-center gap-2 rounded-control border px-4 py-3 font-LexendDeca text-sm font-semibold transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
              likePending ? 'cursor-not-allowed opacity-60' : null,
              liked
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                : 'border-border-default bg-surface-0 text-text-strong hover:bg-surface-2',
            )}
            aria-pressed={liked}
            aria-label="좋아요 토글"
          >
            <Icon name="heart" filled={liked} className="h-5 w-5" />
            좋아요
            <span className="text-text-muted">({likeCount})</span>
          </button>

          <button
            type="button"
            onClick={onToggleBookmark}
            disabled={bookmarkPending}
            className={cx(
              'flex flex-1 items-center justify-center gap-2 rounded-control border px-4 py-3 font-LexendDeca text-sm font-semibold transition',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
              bookmarkPending ? 'cursor-not-allowed opacity-60' : null,
              bookmarked
                ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                : 'border-border-default bg-surface-0 text-text-strong hover:bg-surface-2',
            )}
            aria-pressed={bookmarked}
            aria-label="북마크 토글"
          >
            <Icon name="bookmark" filled={bookmarked} className="h-5 w-5" />
            북마크
          </button>

          <Button
            variant="secondary"
            size="lg"
            className="h-[46px] shrink-0 px-4"
            onClick={() => {
              if (!orgLink) return;
              window.open(orgLink, '_blank', 'noopener,noreferrer');
            }}
            disabled={!orgLink}
            ariaLabel="공식 사이트 열기"
          >
            <span className="hidden sm:inline">공식 사이트</span>
            <span className="sm:hidden">링크</span>
            <Icon name="link" className="h-5 w-5" />
          </Button>
        </div>
      </PageContainer>
    </div>
  );
}

function DetailTabs({
  value,
  onChange,
  hasMap,
}: {
  value: TabKey;
  onChange: (next: TabKey) => void;
  hasMap: boolean;
}) {
  const tabs: Array<{ key: TabKey; label: string; disabled?: boolean }> = [
    { key: 'info', label: '정보' },
    { key: 'content', label: '소개' },
    { key: 'map', label: '지도', disabled: !hasMap },
  ];
  const enabledTabs = tabs.filter((t) => !t.disabled);
  const currentIdx = Math.max(
    0,
    enabledTabs.findIndex((t) => t.key === value),
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (currentIdx + delta + enabledTabs.length) % enabledTabs.length;
    onChange(enabledTabs[nextIdx].key);
  };

  return (
    <div className="md:hidden">
      <div
        className="grid grid-cols-3 gap-2"
        role="tablist"
        aria-label="상세 섹션 탭"
        onKeyDown={onKeyDown}
      >
        {tabs.map((t) => {
          const selected = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`detail-panel-${t.key}`}
              id={`detail-tab-${t.key}`}
              disabled={t.disabled}
              onClick={() => onChange(t.key)}
              className={cx(
                'h-11 rounded-control border text-sm font-semibold transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                selected
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                  : 'border-border-default bg-surface-0 text-text-strong hover:bg-surface-2',
                t.disabled ? 'cursor-not-allowed opacity-50 hover:bg-surface-0' : null,
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const festivalId = id ?? '';
  const { isAuthenticated } = useAuthStore();
  const { push } = useToast();

  const detailQuery = useFestivalDetailQuery(festivalId, {
    enabled: Boolean(festivalId),
  });
  const toggleLikeMutation = useToggleFestivalLikeMutation({
    onError: () => {
      push('좋아요 처리 중 문제가 발생했습니다', 'error');
    },
  });
  const toggleBookmarkMutation = useToggleFestivalBookmarkMutation({
    onError: () => {
      push('북마크 처리 중 문제가 발생했습니다', 'error');
    },
  });
  const likeMutation = useLikeFestivalMutation({
    onError: () => {
      push('좋아요 처리 중 문제가 발생했습니다', 'error');
    },
  });

  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [shareHint, setShareHint] = useState<string | null>(null);

  const festival = detailQuery.data ?? null;
  const liked = Boolean(festival?.liked);
  const bookmarked = Boolean(festival?.bookmarked);
  const likeCount = Math.max(0, festival?.festival_like ?? 0);

  const hasMap = Boolean(festival?.lat != null && festival?.lot != null);
  const freeLabel = getFreeLabel(festival?.is_free ?? null);

  const onShare = useCallback(async () => {
    const url = window.location.href;
    setShareHint(null);

    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: festival?.title ?? undefined, url });
        setShareHint('공유가 완료되었습니다');
        window.setTimeout(() => setShareHint(null), 1500);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setShareHint('링크를 복사했습니다');
        window.setTimeout(() => setShareHint(null), 1500);
        return;
      }

      setShareHint('공유를 지원하지 않는 환경입니다');
      window.setTimeout(() => setShareHint(null), 1500);
    } catch (e) {
      setShareHint('공유에 실패했습니다');
      window.setTimeout(() => setShareHint(null), 1500);
    }
  }, [festival?.title]);

  const handleToggleLike = useCallback(() => {
    if (!festivalId) return;

    if (isAuthenticated) {
      toggleLikeMutation.mutate(festivalId);
      return;
    }

    const localLikeKey = `festival_like_once:${festivalId}`;
    try {
      if (window.localStorage.getItem(localLikeKey)) {
        push('이미 좋아요를 눌렀습니다', 'info');
        return;
      }
    } catch {
      // localStorage 접근이 불가한 환경에서는 중복 체크를 생략합니다.
    }

    likeMutation.mutate(festivalId, {
      onSuccess: () => {
        try {
          window.localStorage.setItem(localLikeKey, '1');
        } catch {
          // localStorage 접근이 불가한 환경에서는 저장을 생략합니다.
        }
        push('좋아요를 반영했습니다', 'success');
      },
    });
  }, [festivalId, isAuthenticated, likeMutation, push, toggleLikeMutation]);

  const handleToggleBookmark = useCallback(() => {
    if (!festivalId) return;

    if (isAuthenticated) {
      toggleBookmarkMutation.mutate(festivalId);
      return;
    }

    push('북마크는 로그인이 필요합니다', 'info');
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    const params = new URLSearchParams({ returnTo });
    navigate(`/auth/login?${params.toString()}`);
  }, [
    festivalId,
    isAuthenticated,
    location.hash,
    location.pathname,
    location.search,
    navigate,
    push,
    toggleBookmarkMutation,
  ]);

  if (detailQuery.isLoading) return <DetailSkeleton />;

  const apiError = detailQuery.error as ApiError | null;
  const isNotFound =
    detailQuery.isError &&
    (apiError?.statusCode === 404 || apiError?.httpStatus === 404);

  if (detailQuery.isError && !isNotFound) {
    return (
      <div className="min-h-screen bg-surface-1 py-10">
        <PageContainer>
          <ErrorState
            title="상세 정보를 불러올 수 없습니다"
            description={apiError?.message ?? '잠시 후 다시 시도해주세요.'}
            onRetry={() => {
              detailQuery.refetch();
            }}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/explore')}
              ariaLabel="탐색으로 이동"
            >
              탐색으로 이동
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  if (isNotFound || !festival) {
    return (
      <div className="min-h-screen bg-surface-1 py-10">
        <PageContainer>
          <EmptyState
            title="축제를 찾을 수 없습니다"
            description="다른 행사도 탐색해보세요."
            primaryAction={{
              label: '탐색으로 이동',
              onClick: () => navigate('/explore'),
            }}
            secondaryAction={{
              label: '이전으로',
              onClick: () => navigate(-1),
            }}
          />
        </PageContainer>
      </div>
    );
  }

  const heroHasImage = Boolean(festival.main_img);

  return (
    <div className="min-h-screen bg-surface-1">
      <section className="relative overflow-hidden">
        {heroHasImage ? (
          <>
            <img
              src={festival.main_img ?? ''}
              alt=""
              className="h-[260px] w-full object-cover md:h-[360px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/10" />
          </>
        ) : (
          <>
            <div className="h-[260px] w-full bg-gradient-to-br from-brand-primary via-brand-primary/90 to-brand-primary/60 md:h-[360px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />
          </>
        )}

        {/* TopBar */}
        <div className="absolute inset-x-0 top-0">
          <PageContainer className="flex items-center justify-between py-4 md:py-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={cx(
                'inline-flex h-10 w-10 items-center justify-center rounded-control border border-white/20 bg-white/10 text-white',
                'hover:bg-white/15 transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30',
              )}
              aria-label="이전 페이지로 이동"
            >
              <Icon name="arrowLeft" className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onShare}
                className={cx(
                  'inline-flex h-10 w-10 items-center justify-center rounded-control border border-white/20 bg-white/10 text-white',
                  'hover:bg-white/15 transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30',
                )}
                aria-label="공유"
              >
                <Icon name="share" className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={handleToggleBookmark}
                disabled={toggleBookmarkMutation.isPending}
                className={cx(
                  'inline-flex h-10 w-10 items-center justify-center rounded-control border border-white/20 bg-white/10 text-white',
                  'hover:bg-white/15 transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30',
                  toggleBookmarkMutation.isPending
                    ? 'cursor-not-allowed opacity-60'
                    : null,
                )}
                aria-label="북마크 토글"
                aria-pressed={bookmarked}
              >
                <Icon name="bookmark" filled={bookmarked} className="h-5 w-5" />
              </button>
            </div>
          </PageContainer>
        </div>

        {/* InfoCard overlay */}
        <div className="absolute inset-x-0 bottom-0">
          <PageContainer className="pb-5 md:pb-6">
            <div className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft md:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="category" categoryName={festival.major_code_name}>
                  {festival.major_code_name ?? '분류'}
                </Badge>
                {freeLabel ? (
                  <Badge variant="info">{freeLabel}</Badge>
                ) : null}
                {festival.gu_name ? (
                  <Badge variant="neutral">{festival.gu_name}</Badge>
                ) : null}
              </div>

              <h1 className="mt-3 font-LexendDeca text-2xl font-extrabold leading-tight text-text-strong md:text-3xl">
                {safeTitle(festival.title)}
              </h1>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-text-default md:grid-cols-3">
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <p className="text-xs font-semibold text-text-muted">기간</p>
                  <p className="mt-1 font-semibold text-text-strong">
                    {formatDateRange(festival.strt_date, festival.end_date)}
                  </p>
                </div>
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <p className="text-xs font-semibold text-text-muted">장소</p>
                  <p className="mt-1 font-semibold text-text-strong">
                    {safeText(festival.place, '장소 정보가 없습니다')}
                  </p>
                </div>
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <p className="text-xs font-semibold text-text-muted">
                    조회 · 좋아요
                  </p>
                  <p className="mt-1 font-semibold text-text-strong">
                    {festival.festival_view.toLocaleString()} ·{' '}
                    {likeCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {shareHint ? (
                <p className="mt-3 text-sm font-semibold text-text-muted">
                  {shareHint}
                </p>
              ) : null}

              {/* Desktop inline action bar */}
              <div className="mt-5">
                <DetailActionBar
                  likeCount={likeCount}
                  liked={liked}
                  bookmarked={bookmarked}
                  likePending={toggleLikeMutation.isPending || likeMutation.isPending}
                  bookmarkPending={toggleBookmarkMutation.isPending}
                  onToggleLike={handleToggleLike}
                  onToggleBookmark={handleToggleBookmark}
                  orgLink={festival.org_link}
                  variant="desktopInline"
                />
              </div>
            </div>
          </PageContainer>
        </div>
      </section>

      <main className="py-8 md:py-10">
        <PageContainer className="space-y-8">
          {/* Mobile tabs */}
          <DetailTabs
            value={activeTab}
            onChange={setActiveTab}
            hasMap={hasMap}
          />

          {/* Mobile panels */}
          <div className="md:hidden">
            <section
              id="detail-panel-info"
              role="tabpanel"
              aria-labelledby="detail-tab-info"
              hidden={activeTab !== 'info'}
              className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft"
            >
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                정보
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 font-semibold text-text-muted">주소</dt>
                  <dd className="text-right font-semibold text-text-strong">
                    {safeText(festival.address, '주소 정보가 없습니다')}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 font-semibold text-text-muted">연락처</dt>
                  <dd className="text-right font-semibold text-text-strong">
                    {safeText(festival.phone, '연락처 정보가 없습니다')}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <dt className="shrink-0 font-semibold text-text-muted">카테고리</dt>
                  <dd className="text-right font-semibold text-text-strong">
                    {safeText(festival.sub_code_name, '세부 분류 없음')}
                  </dd>
                </div>
              </dl>
            </section>

            <section
              id="detail-panel-content"
              role="tabpanel"
              aria-labelledby="detail-tab-content"
              hidden={activeTab !== 'content'}
              className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft"
            >
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                소개
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-default">
                {festival.content?.trim()
                  ? festival.content
                  : '소개 정보가 없습니다.'}
              </p>
            </section>

            <section
              id="detail-panel-map"
              role="tabpanel"
              aria-labelledby="detail-tab-map"
              hidden={activeTab !== 'map'}
              className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft"
            >
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                지도
              </h2>
              {hasMap ? (
                <div className="mt-4">
                  <DetailMapPlaceholder address={festival.address} />
                </div>
              ) : (
                <p className="mt-4 text-sm font-semibold text-text-muted">
                  위치 정보가 없습니다.
                </p>
              )}
            </section>
          </div>

          {/* Desktop sections */}
          <div className="hidden space-y-8 md:block">
            <section className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                정보
              </h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <dt className="text-xs font-semibold text-text-muted">주소</dt>
                  <dd className="mt-1 font-semibold text-text-strong">
                    {safeText(festival.address, '주소 정보가 없습니다')}
                  </dd>
                </div>
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <dt className="text-xs font-semibold text-text-muted">
                    연락처
                  </dt>
                  <dd className="mt-1 font-semibold text-text-strong">
                    {safeText(festival.phone, '연락처 정보가 없습니다')}
                  </dd>
                </div>
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <dt className="text-xs font-semibold text-text-muted">
                    세부 분류
                  </dt>
                  <dd className="mt-1 font-semibold text-text-strong">
                    {safeText(festival.sub_code_name, '세부 분류 없음')}
                  </dd>
                </div>
                <div className="rounded-control border border-border-default bg-surface-0 px-4 py-3">
                  <dt className="text-xs font-semibold text-text-muted">
                    공식 링크
                  </dt>
                  <dd className="mt-1 font-semibold text-text-strong">
                    {festival.org_link ? '제공' : '없음'}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
              <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                소개
              </h2>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-text-default">
                {festival.content?.trim()
                  ? festival.content
                  : '소개 정보가 없습니다.'}
              </p>
            </section>

            {hasMap ? (
              <section className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
                <h2 className="font-LexendDeca text-lg font-bold text-text-strong">
                  지도
                </h2>
                <div className="mt-4">
                  <DetailMapPlaceholder address={festival.address} />
                </div>
              </section>
            ) : null}
          </div>
        </PageContainer>
      </main>

      {/* Mobile sticky action bar */}
      <DetailActionBar
        likeCount={likeCount}
        liked={liked}
        bookmarked={bookmarked}
        likePending={toggleLikeMutation.isPending || likeMutation.isPending}
        bookmarkPending={toggleBookmarkMutation.isPending}
        onToggleLike={handleToggleLike}
        onToggleBookmark={handleToggleBookmark}
        orgLink={festival.org_link}
        variant="mobileSticky"
      />

      {/* sticky bar spacer */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </div>
  );
}

export default DetailPage;
