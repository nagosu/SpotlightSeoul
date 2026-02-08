/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';
import Button from './Button';

export type EmptyStateAction = {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export type EmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  icon?: ReactNode;
};

export default function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="rounded-card border border-border-default bg-surface-0 p-6 text-center shadow-soft">
      {icon ? (
        <div className="mx-auto mb-3 w-fit text-text-muted">{icon}</div>
      ) : null}
      <h3 className="font-LexendDeca text-base font-bold text-text-strong">
        {title}
      </h3>
      {description ? (
        <p className="mt-2 text-sm text-text-muted">{description}</p>
      ) : null}

      {primaryAction || secondaryAction ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {secondaryAction ? (
            <Button
              variant={secondaryAction.variant ?? 'secondary'}
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button
              variant={primaryAction.variant ?? 'primary'}
              size="sm"
              onClick={primaryAction.onClick}
            >
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
