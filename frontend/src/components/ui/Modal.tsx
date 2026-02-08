/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { useEffect, useId, useRef } from 'react';

export type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  /**
   * true면 오버레이 클릭으로 닫습니다.
   * 기본값: true
   */
  closeOnOverlayClick?: boolean;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function getFocusable(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
    ),
  ).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  );
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  closeOnOverlayClick = true,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return () => {
        // noop
      };
    }

    lastActiveRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusables = getFocusable(panel);
      (focusables[0] ?? panel).focus();
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Tab') {
        const currentPanel = panelRef.current;
        if (currentPanel) {
          const focusables = getFocusable(currentPanel);
          if (focusables.length === 0) {
            e.preventDefault();
            currentPanel.focus();
          } else {
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!e.shiftKey && active === last) {
              e.preventDefault();
              first.focus();
            } else if (e.shiftKey && active === first) {
              e.preventDefault();
              last.focus();
            }
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastActiveRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default bg-black/40"
        aria-label="모달 닫기"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        className={cx(
          'relative z-[101] w-full max-w-lg rounded-card border border-border-default bg-surface-0 p-5 shadow-lift outline-none',
        )}
      >
        {title ? (
          <div className="mb-3 flex items-start justify-between gap-3">
            <h2
              id={titleId}
              className="font-LexendDeca text-lg font-bold text-text-strong"
            >
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm font-semibold text-text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              닫기
            </button>
          </div>
        ) : (
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm font-semibold text-text-muted hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              닫기
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
}
