/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
export type FilterChipProps = {
  selected?: boolean;
  label: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function FilterChip({
  selected = false,
  label,
  className,
  disabled,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={selected}
      onClick={onClick}
      className={cx(
        'inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-semibold transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-50' : null,
        selected
          ? 'border-brand-primary bg-brand-primary text-white'
          : 'border-border-default bg-surface-0 text-text-strong hover:bg-surface-2',
        className,
      )}
    >
      {label}
    </button>
  );
}
