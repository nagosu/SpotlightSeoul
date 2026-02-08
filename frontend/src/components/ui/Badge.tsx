/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';

export type BadgeVariant =
  | 'category'
  | 'info'
  | 'success'
  | 'warning'
  | 'neutral';
export type BadgeSize = 'sm' | 'md';

export type BadgeProps = {
  children?: ReactNode;
  className?: string;
  title?: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  /**
   * variant가 category일 때 카테고리명(공연/전시/축제/교육/체험/기타 등)
   * 을 전달하면 색상이 자동 매핑됩니다.
   */
  categoryName?: string | null;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function categoryClass(categoryName?: string | null) {
  switch (categoryName) {
    case '공연':
      return 'bg-category-show text-white';
    case '전시':
      return 'bg-category-exhibition text-white';
    case '축제':
      return 'bg-category-festival text-text-strong';
    case '교육/체험':
    case '교육':
    case '체험':
      return 'bg-category-education text-text-strong';
    case '기타':
      return 'bg-category-etc text-white';
    default:
      return 'bg-surface-2 text-text-strong';
  }
}

const base =
  'inline-flex items-center justify-center whitespace-nowrap rounded-full font-LexendDeca font-semibold';

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'h-6 px-2 text-xs',
  md: 'h-7 px-2.5 text-xs',
};

const variantStyles: Record<Exclude<BadgeVariant, 'category'>, string> = {
  info: 'bg-surface-2 text-text-strong',
  success: 'bg-[#DCFCE7] text-[#166534]',
  warning: 'bg-[#FEF3C7] text-[#92400E]',
  neutral: 'bg-surface-2 text-text-muted',
};

export default function Badge({
  variant = 'neutral',
  size = 'sm',
  categoryName,
  className,
  title,
  children,
}: BadgeProps) {
  const color =
    variant === 'category'
      ? categoryClass(categoryName)
      : variantStyles[variant];

  return (
    <span
      title={title}
      className={cx(base, sizeStyles[size], color, className)}
    >
      {children}
    </span>
  );
}
