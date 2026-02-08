/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { Link } from 'react-router-dom';
import type { FestivalMostResponse } from '@/api/types';
import Badge from './Badge';

export type RankingCardProps = {
  festival: FestivalMostResponse;
  /** 1, 2, 3, ... */
  rank: number;
  /** "좋아요" | "조회" */
  statLabel: string;
  statValue: number;
  /** 조회 TOP 등에서 카테고리 배지를 숨길 때 사용 */
  showCategory?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return 'bg-[#FFD700] text-black';
  if (rank === 2) return 'bg-[#C0C0C0] text-black';
  if (rank === 3) return 'bg-[#CD7F32] text-black';
  return 'bg-surface-2 text-text-strong';
}

export default function RankingCard({
  festival,
  rank,
  statLabel,
  statValue,
  showCategory = true,
}: RankingCardProps) {
  const hasThumb = Boolean(festival.thumb_img);

  return (
    <Link
      to={`/festivals/${festival.id}`}
      className={cx(
        'group block rounded-card border border-border-default bg-surface-0 shadow-soft transition',
        'hover:-translate-y-0.5 hover:shadow-lift',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
      )}
    >
      <div className="flex items-stretch gap-4 p-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-control bg-surface-2">
          {hasThumb ? (
            <img
              src={festival.thumb_img ?? undefined}
              alt={festival.title ?? '축제 이미지'}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-surface-2 to-surface-1" />
          )}

          <div className="absolute left-2 top-2">
            <span
              className={cx(
                'min-w-7 inline-flex h-7 items-center justify-center rounded-full px-2 text-xs font-extrabold',
                rankBadgeClass(rank),
              )}
              aria-label={`${rank}위`}
              title={`${rank}위`}
            >
              {rank}
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 font-LexendDeca text-sm font-bold text-text-strong md:text-base">
                {festival.title ?? '제목 없음'}
              </h3>
              <p className="mt-1 line-clamp-1 text-sm text-text-muted">
                {festival.place ?? '장소 정보 없음'}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-xs text-text-muted">{statLabel}</p>
              <p className="font-LexendDeca text-base font-extrabold text-text-strong">
                {statValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-text-muted">
              {festival.gu_name ?? '지역 정보 없음'}
            </p>

            {showCategory ? (
              <Badge
                variant="category"
                categoryName={festival.major_code_name}
                size="sm"
              >
                {festival.major_code_name ?? '카테고리'}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
