// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { Link } from 'react-router-dom';
import type { FestivalNearResponse } from '@/api';
import Badge from './Badge';

export type NearbyFestivalCardProps = {
  festival: FestivalNearResponse;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatPeriod(strt?: string | null, end?: string | null) {
  if (!strt && !end) return '기간 정보 없음';
  if (strt && end) return `${strt} ~ ${end}`;
  return strt ?? end ?? '기간 정보 없음';
}

function formatDistance(distanceKm: number) {
  if (Number.isNaN(distanceKm)) return '-';
  if (distanceKm < 1) return `${(distanceKm * 1000).toFixed(0)}m`;
  return `${distanceKm.toFixed(1)}km`;
}

export default function NearbyFestivalCard({
  festival,
}: NearbyFestivalCardProps) {
  const period = formatPeriod(festival.strt_date, festival.end_date);
  const region = festival.gu_name ?? festival.address ?? '지역 정보 없음';
  const hasThumb = Boolean(festival.thumb_img);
  const distanceLabel = formatDistance(festival.distance_km);

  return (
    <Link
      to={`/festivals/${festival.id}`}
      className={cx(
        'group block rounded-card border border-border-default bg-surface-0 shadow-soft transition',
        'hover:-translate-y-0.5 hover:shadow-lift',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
      )}
    >
      {/* 모바일: 가로 리스트형 / 데스크톱: 세로 카드형 */}
      <div className="flex gap-3 p-3 md:block md:p-0">
        {/* 썸네일 */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-control md:aspect-[16/10] md:h-auto md:w-full md:rounded-card">
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

          {/* 데스크톱 오버레이 배지 */}
          <div className="absolute left-2 top-2 hidden gap-1 md:flex">
            <Badge
              variant="category"
              categoryName={festival.major_code_name}
              size="sm"
            >
              {festival.major_code_name ?? '카테고리'}
            </Badge>
            <Badge variant="info" size="sm" title="거리">
              {distanceLabel}
            </Badge>
          </div>
        </div>

        {/* 정보 */}
        <div className="min-w-0 flex-1 md:p-4">
          {/* 모바일 상단 배지 */}
          <div className="flex items-center gap-2 md:hidden">
            <Badge
              variant="category"
              categoryName={festival.major_code_name}
              size="sm"
            >
              {festival.major_code_name ?? '카테고리'}
            </Badge>
            <Badge variant="info" size="sm" title="거리">
              {distanceLabel}
            </Badge>
          </div>

          <h3 className="mt-2 line-clamp-2 font-LexendDeca text-base font-bold text-text-strong md:mt-0">
            {festival.title ?? '제목 없음'}
          </h3>
          <p className="mt-2 text-sm text-text-muted">{period}</p>
          <p className="mt-1 text-sm text-text-default">{region}</p>
        </div>
      </div>
    </Link>
  );
}
