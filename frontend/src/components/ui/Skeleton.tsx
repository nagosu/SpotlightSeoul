/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
export type SkeletonVariant = 'card' | 'text' | 'image' | 'listRow';

export type SkeletonProps = {
  variant?: SkeletonVariant;
  className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const base = 'animate-pulse rounded-md bg-surface-2';

const variantStyles: Record<SkeletonVariant, string> = {
  card: 'h-48 w-full rounded-card',
  text: 'h-4 w-full',
  image: 'h-40 w-full rounded-card',
  listRow: 'h-14 w-full rounded-control',
};

export default function Skeleton({
  variant = 'text',
  className,
}: SkeletonProps) {
  return <div className={cx(base, variantStyles[variant], className)} />;
}
