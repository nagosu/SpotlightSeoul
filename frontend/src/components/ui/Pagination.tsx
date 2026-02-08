/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).

export type PaginationProps = {
  currentPage: number; // 1-based
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function buildPages(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  pages.add(current);
  pages.add(current - 1);
  pages.add(current + 1);

  const normalized = Array.from(pages)
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: Array<number | '...'> = [];
  for (let i = 0; i < normalized.length; i += 1) {
    const p = normalized[i];
    const prev = normalized[i - 1];
    if (i > 0 && prev && p - prev > 1) result.push('...');
    result.push(p);
  }
  return result;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav
      className={cx('flex items-center justify-center gap-1', className)}
      aria-label="페이지네이션"
    >
      <button
        type="button"
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
        className={cx(
          'h-10 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-strong shadow-soft transition',
          'hover:bg-surface-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          !canPrev ? 'cursor-not-allowed opacity-50 hover:bg-surface-0' : null,
        )}
        aria-label="이전 페이지"
      >
        이전
      </button>

      <div className="mx-1 flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            const prev = pages[idx - 1];
            const next = pages[idx + 1];
            return (
              <span
                key={`ellipsis-${String(prev)}-${String(next)}`}
                className="px-2 text-sm font-semibold text-text-muted"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const selected = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={selected ? 'page' : undefined}
              aria-label={`${p}페이지`}
              className={cx(
                'min-w-10 h-10 rounded-control border px-3 text-sm font-semibold shadow-soft transition',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
                selected
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-border-default bg-surface-0 text-text-strong hover:bg-surface-2',
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
        className={cx(
          'h-10 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-strong shadow-soft transition',
          'hover:bg-surface-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          !canNext ? 'cursor-not-allowed opacity-50 hover:bg-surface-0' : null,
        )}
        aria-label="다음 페이지"
      >
        다음
      </button>
    </nav>
  );
}
