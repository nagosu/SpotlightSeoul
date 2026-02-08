/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import type { ReactNode } from 'react';

export type PageContainerProps = {
  children?: ReactNode;
  className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function PageContainer({
  children,
  className,
}: PageContainerProps) {
  return (
    <div
      className={cx(
        'mx-auto w-full max-w-screen-lg px-4 md:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}
