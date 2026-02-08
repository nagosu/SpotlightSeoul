export type ToastVariant = 'success' | 'error' | 'info';

export type ToastItem = {
  id: string;
  variant: ToastVariant;
  message: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-[#16A34A] text-white',
  error: 'bg-[#DC2626] text-white',
  info: 'bg-text-strong text-white',
};

export default function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: () => void;
}) {
  return (
    <div
      className={cx(
        'pointer-events-auto flex max-w-sm items-start gap-3 rounded-control px-4 py-3 shadow-lift',
        variantStyles[toast.variant],
      )}
      role="status"
      aria-live="polite"
    >
      <p className="min-w-0 flex-1 text-sm font-semibold">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="font-bold/none rounded-md px-2 py-1 text-xs text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/30"
        aria-label="토스트 닫기"
      >
        닫기
      </button>
    </div>
  );
}
