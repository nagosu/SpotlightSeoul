/* eslint-disable react/require-default-props */
// TypeScript 기본값으로 처리합니다(퍼블리싱 단계).
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type BottomSheetProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function getFocusableElements(root: HTMLElement) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(
    root.querySelectorAll<HTMLElement>(selectors.join(',')),
  ).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'),
  );
}

export default function BottomSheet({
  open,
  title,
  children,
  onClose,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [rendered, setRendered] = useState(open);
  const [animateIn, setAnimateIn] = useState(false);

  const portalTarget = useMemo(() => {
    if (typeof document === 'undefined') return null;
    return document.body;
  }, []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      // mount -> next frame animate in
      requestAnimationFrame(() => setAnimateIn(true));
    } else if (rendered) {
      setAnimateIn(false);
      window.setTimeout(() => setRendered(false), 200);
    }
  }, [open, rendered]);

  useEffect(() => {
    if (!rendered) return undefined;

    const previousActive = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;
      const root = sheetRef.current;
      if (!root) return;
      const focusables = getFocusableElements(root);
      if (focusables.length === 0) {
        e.preventDefault();
        root.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (!active || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!active || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    // initial focus
    window.setTimeout(() => {
      const root = sheetRef.current;
      if (!root) return;
      const focusables = getFocusableElements(root);
      (focusables[0] ?? root).focus();
    }, 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousActive?.focus?.();
    };
  }, [rendered, onClose]);

  // prevent background scroll when rendered
  useEffect(() => {
    if (!rendered) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [rendered]);

  if (!rendered || !portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <button
        type="button"
        className={cx(
          'absolute inset-0 h-full w-full bg-black/40 transition-opacity duration-200',
          animateIn ? 'opacity-100' : 'opacity-0',
        )}
        aria-label="필터 닫기"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? '바텀시트'}
        ref={sheetRef}
        tabIndex={-1}
        className={cx(
          'absolute bottom-0 left-0 right-0 mx-auto w-full max-w-screen-sm',
          'rounded-t-2xl border border-border-default bg-surface-0 shadow-lift outline-none',
          'transition-transform duration-200 ease-out',
          animateIn ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <div className="px-4 pb-3 pt-3">
          <div
            className="mx-auto h-1.5 w-10 rounded-full bg-border-default"
            aria-hidden="true"
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <h2 className="min-w-0 truncate font-LexendDeca text-base font-bold text-text-strong">
              {title ?? '필터'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className={cx(
                'h-9 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-strong shadow-soft transition',
                'hover:bg-surface-2',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
              )}
            >
              닫기
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-auto px-4 pb-6">{children}</div>
      </div>
    </div>,
    portalTarget,
  );
}
