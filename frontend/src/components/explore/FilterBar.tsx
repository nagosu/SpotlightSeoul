import { useMemo, useState } from 'react';
import type { FestivalListParams } from '@/api/types';
import { BottomSheet, Button, FilterChip, Select } from '@/components/ui';

export type ExploreFilters = {
  q: string;
  status: NonNullable<FestivalListParams['status']>;
  sort: NonNullable<FestivalListParams['sort']>;
  strtDate: string;
  endDate: string;
};

export type FilterBarProps = {
  filters: ExploreFilters;
  onChange: (next: Partial<ExploreFilters>) => void;
  onReset: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function countApplied(filters: ExploreFilters) {
  let count = 0;
  if (filters.status !== 'all') count += 1;
  if (filters.sort !== 'recent') count += 1;
  if (filters.strtDate) count += 1;
  if (filters.endDate) count += 1;
  return count;
}

function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-text-strong"
      >
        {label}
      </label>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cx(
          'h-11 w-full rounded-control border border-border-default bg-surface-0 px-3 text-sm text-text-strong shadow-soft outline-none transition',
          'focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
        )}
      />
    </div>
  );
}

export default function FilterBar({
  filters,
  onChange,
  onReset,
}: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const appliedCount = useMemo(() => countApplied(filters), [filters]);

  const sortOptions = useMemo(
    () => [
      { label: '최신순', value: 'recent' },
      { label: '좋아요순', value: 'like' },
      { label: '조회순', value: 'view' },
      { label: '마감임박순', value: 'end_date' },
    ],
    [],
  );

  return (
    <div className="space-y-3">
      {/* 상태 칩 (모바일/데스크톱 공통, 가로 스크롤) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <FilterChip
          label="전체"
          selected={filters.status === 'all'}
          onClick={() => onChange({ status: 'all' })}
        />
        <FilterChip
          label="예정"
          selected={filters.status === 'upcoming'}
          onClick={() => onChange({ status: 'upcoming' })}
        />
        <FilterChip
          label="진행중"
          selected={filters.status === 'ongoing'}
          onClick={() => onChange({ status: 'ongoing' })}
        />
        <FilterChip
          label="종료"
          selected={filters.status === 'ended'}
          onClick={() => onChange({ status: 'ended' })}
        />

        <div className="ml-auto flex items-center gap-2">
          {/* 모바일: 필터 버튼 -> BottomSheet */}
          <Button
            variant="secondary"
            size="sm"
            className="md:hidden"
            onClick={() => setSheetOpen(true)}
            ariaLabel="필터 열기"
          >
            필터{appliedCount ? ` (${appliedCount})` : ''}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onReset}
            ariaLabel="필터 초기화"
          >
            초기화
          </Button>
        </div>
      </div>

      {/* 데스크톱: 인라인 필터 */}
      <div className="hidden grid-cols-12 gap-3 md:grid">
        <div className="col-span-3">
          <Select
            id="explore-sort"
            label="정렬"
            value={filters.sort}
            onChange={(e) =>
              onChange({ sort: e.target.value as ExploreFilters['sort'] })
            }
            options={sortOptions}
            placeholder="정렬 선택"
          />
        </div>
        <div className="col-span-3">
          <DateField
            id="explore-strtDate"
            label="시작일"
            value={filters.strtDate}
            onChange={(v) => onChange({ strtDate: v })}
          />
        </div>
        <div className="col-span-3">
          <DateField
            id="explore-endDate"
            label="종료일"
            value={filters.endDate}
            onChange={(v) => onChange({ endDate: v })}
          />
        </div>
        <div className="col-span-3 flex items-end justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            ariaLabel="필터 초기화"
          >
            초기화
          </Button>
        </div>
      </div>

      {/* 모바일 BottomSheet */}
      <BottomSheet
        open={sheetOpen}
        title="필터"
        onClose={() => setSheetOpen(false)}
      >
        <div className="space-y-4">
          <Select
            id="explore-sort-mobile"
            label="정렬"
            value={filters.sort}
            onChange={(e) =>
              onChange({ sort: e.target.value as ExploreFilters['sort'] })
            }
            options={sortOptions}
            placeholder="정렬 선택"
          />
          <div className="grid grid-cols-1 gap-3">
            <DateField
              id="explore-strtDate-mobile"
              label="시작일"
              value={filters.strtDate}
              onChange={(v) => onChange({ strtDate: v })}
            />
            <DateField
              id="explore-endDate-mobile"
              label="종료일"
              value={filters.endDate}
              onChange={(v) => onChange({ endDate: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                onReset();
              }}
              ariaLabel="필터 초기화"
            >
              초기화
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setSheetOpen(false)}
              ariaLabel="적용하고 닫기"
            >
              적용
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
