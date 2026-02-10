/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui';

export type SearchBarProps = {
  value: string;
  suggestions: string[];
  isLoading?: boolean;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onSelectSuggestion?: (value: string) => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function SearchBar({
  value,
  suggestions,
  isLoading = false,
  placeholder = '검색어로 축제를 찾아보세요',
  onChange,
  onSubmit,
  onSelectSuggestion,
}: SearchBarProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const filtered = useMemo(() => suggestions.slice(0, 8), [suggestions]);
  const hasEnoughQueryLength = value.trim().length >= 2;

  useEffect(() => {
    const shouldOpen =
      hasEnoughQueryLength && (isLoading || filtered.length > 0);
    if (!shouldOpen) {
      setActiveIndex(-1);
      setOpen(false);
      return;
    }
    setOpen(true);
    setActiveIndex((prev) =>
      prev >= 0 ? Math.min(prev, filtered.length - 1) : 0,
    );
  }, [filtered.length, hasEnoughQueryLength, isLoading]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (e.target instanceof Node && !root.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const submit = (next: string) => {
    onSubmit(next);
    setOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div ref={rootRef} className="relative">
      <Input
        id="explore-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            if (open && activeIndex >= 0 && filtered[activeIndex]) {
              const next = filtered[activeIndex];
              onChange(next);
              onSelectSuggestion?.(next);
              submit(next);
              return;
            }
            submit(value);
            return;
          }

          if (e.key === 'Escape') {
            setOpen(false);
            setActiveIndex(-1);
            return;
          }

          if (!open) return;

          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((idx) => Math.min(idx + 1, filtered.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((idx) => Math.max(idx - 1, 0));
          }
        }}
        placeholder={placeholder}
        prefixIcon={<span aria-hidden="true">⌕</span>}
        suffixButton={
          value ? (
            <button
              type="button"
              onClick={() => {
                onChange('');
                setOpen(false);
                setActiveIndex(-1);
              }}
              className={cx(
                'h-8 rounded-control border border-border-default bg-surface-0 px-2 text-xs font-semibold text-text-muted shadow-soft transition',
                'hover:bg-surface-2',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
              )}
              aria-label="검색어 지우기"
            >
              지우기
            </button>
          ) : null
        }
        className="pr-1"
      />

      {open ? (
        <div
          role="listbox"
          id={listboxId}
          aria-label="검색 자동완성"
          className={cx(
            'absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-card border border-border-default bg-surface-0 shadow-lift',
          )}
        >
          <ul className="max-h-64 overflow-auto py-1">
            {isLoading ? (
              <li
                className="px-4 py-2 text-sm text-text-muted"
                aria-live="polite"
              >
                자동완성 검색 중...
              </li>
            ) : null}
            {filtered.map((s, idx) => {
              const selected = idx === activeIndex;
              return (
                <li key={s} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onMouseDown={(e) => {
                      // blur 전에 선택되도록
                      e.preventDefault();
                    }}
                    onClick={() => {
                      onChange(s);
                      onSelectSuggestion?.(s);
                      submit(s);
                    }}
                    className={cx(
                      'w-full px-4 py-2.5 text-left text-sm transition',
                      selected
                        ? 'bg-surface-2 text-text-strong'
                        : 'bg-surface-0 text-text-default hover:bg-surface-2',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary',
                    )}
                  >
                    {s}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
