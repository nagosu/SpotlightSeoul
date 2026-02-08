/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const base =
  'inline-flex items-center justify-center gap-2 font-LexendDeca font-semibold transition ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 ' +
  'disabled:cursor-not-allowed disabled:opacity-50';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm rounded-control',
  md: 'h-11 px-4 text-sm rounded-control',
  lg: 'h-12 px-5 text-base rounded-control',
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-primary text-white shadow-soft hover:shadow-lift active:translate-y-[1px]',
  secondary:
    'bg-surface-0 text-text-strong border border-border-default shadow-soft hover:shadow-lift active:translate-y-[1px]',
  ghost:
    'bg-transparent text-text-strong hover:bg-surface-2 active:bg-surface-2 border border-transparent',
  danger:
    'bg-[#EF4444] text-white shadow-soft hover:shadow-lift active:translate-y-[1px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  type = 'button',
  className,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <button
      type={type === 'submit' ? 'submit' : 'button'}
      className={cx(base, sizeStyles[size], variantStyles[variant], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      <span className="min-w-0">{children}</span>
    </button>
  );
}
