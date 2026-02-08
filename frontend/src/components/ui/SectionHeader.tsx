/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  href?: string;
  rightSlot?: ReactNode;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  href,
  rightSlot,
}: SectionHeaderProps) {
  let actionNode: ReactNode = null;

  if (actionLabel && href) {
    actionNode = (
      <Link
        to={href}
        className={cx(
          'text-sm font-semibold text-brand-primary hover:underline',
          'rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        )}
      >
        {actionLabel}
      </Link>
    );
  } else if (actionLabel && onAction) {
    actionNode = (
      <button
        type="button"
        onClick={onAction}
        className={cx(
          'text-sm font-semibold text-brand-primary hover:underline',
          'rounded-md px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        )}
      >
        {actionLabel}
      </button>
    );
  }

  return (
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-LexendDeca text-lg font-bold text-text-strong md:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        {rightSlot}
        {actionNode}
      </div>
    </div>
  );
}
