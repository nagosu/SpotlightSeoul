/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';
import Button from './Button';

export type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  icon?: ReactNode;
};

export default function ErrorState({
  title,
  description,
  onRetry,
  icon,
}: ErrorStateProps) {
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
      {onRetry ? (
        <div className="mt-4 flex justify-center">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            다시 시도
          </Button>
        </div>
      ) : null}
    </div>
  );
}
