/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { useId, useMemo } from 'react';

export type TabItem = {
  key: string;
  label: string;
  disabled?: boolean;
};

export type TabsProps = {
  /** 탭 목록 */
  items: TabItem[];
  /** 현재 활성 탭 key */
  activeKey: string;
  /** 탭 변경 */
  onChange: (key: string) => void;
  /** tablist aria-label */
  ariaLabel?: string;
  /** 탭 패널 연결용 id base (미지정 시 useId 사용) */
  idBase?: string;
  className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Tabs({
  items,
  activeKey,
  onChange,
  ariaLabel = '탭',
  idBase,
  className,
}: TabsProps) {
  const reactId = useId();
  const base = idBase ?? `tabs-${reactId}`;

  const enabledTabs = useMemo(() => items.filter((t) => !t.disabled), [items]);
  const currentIdx = Math.max(
    0,
    enabledTabs.findIndex((t) => t.key === activeKey),
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (enabledTabs.length === 0) return;
    e.preventDefault();

    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (currentIdx + delta + enabledTabs.length) % enabledTabs.length;
    onChange(enabledTabs[nextIdx].key);
  };

  return (
    <div
      className={cx(
        'flex items-stretch gap-2',
        // 모바일에서 탭 버튼이 너무 작아지지 않도록 최소 높이 확보
        className,
      )}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
    >
      {items.map((t) => {
        const selected = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${base}-panel-${t.key}`}
            id={`${base}-tab-${t.key}`}
            disabled={t.disabled}
            onClick={() => onChange(t.key)}
            className={cx(
              'flex-1 rounded-control border px-3 py-2 text-sm font-semibold transition',
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
  );
}
