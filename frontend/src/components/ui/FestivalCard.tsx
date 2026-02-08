/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { Link } from 'react-router-dom';
import type { FestivalCardBase } from '@/api/types';
import Badge from './Badge';

export type FestivalCardProps = {
  festival: FestivalCardBase & {
    /** 리스트/카드에서 지역 표기가 필요할 때 사용 (없으면 gu_name 사용) */
    address?: string | null;
  };
  showStats?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatPeriod(strt?: string | null, end?: string | null) {
  if (!strt && !end) return '기간 정보 없음';
  if (strt && end) return `${strt} ~ ${end}`;
  return strt ?? end ?? '기간 정보 없음';
}

export default function FestivalCard({
  festival,
  showStats = false,
}: FestivalCardProps) {
  const region = festival.gu_name ?? festival.address ?? '지역 정보 없음';
  const period = formatPeriod(festival.strt_date, festival.end_date);
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
      <div className="overflow-hidden rounded-card">
        <div className="relative aspect-[16/10] w-full">
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

          <div className="absolute left-3 top-3">
            <Badge
              variant="category"
              categoryName={festival.major_code_name}
              size="sm"
            >
              {festival.major_code_name ?? '카테고리'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 font-LexendDeca text-base font-bold text-text-strong">
          {festival.title ?? '제목 없음'}
        </h3>
        <p className="mt-2 text-sm text-text-muted">{period}</p>
        <p className="mt-1 text-sm text-text-default">{region}</p>

        {showStats ? (
          <div className="mt-3 flex items-center gap-3 text-xs text-text-muted">
            <span>좋아요 {festival.festival_like}</span>
            <span>조회 {festival.festival_view}</span>
          </div>
        ) : null}
      </div>
    </Link>
  );
}
