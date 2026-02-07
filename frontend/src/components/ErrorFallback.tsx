import type { ApiError } from '../api/types/common';

type ErrorMode = 'page' | 'section';

type ErrorFallbackProps = {
  error?: unknown;
  mode?: ErrorMode;
  onRetry?: () => void;
  onHome?: () => void;
};

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') return false;
  const e = error as Record<string, unknown>;
  return (
    typeof e.statusCode === 'number' &&
    typeof e.code === 'string' &&
    typeof e.message === 'string'
  );
}

function getMessage(error?: unknown): string {
  if (!error) return '알 수 없는 오류가 발생했습니다';

  if (isApiError(error)) {
    const status = error.statusCode ?? error.httpStatus;
    if (status === 400) return '잘못된 요청입니다';
    if (status === 404) return '요청하신 페이지를 찾을 수 없습니다';
    if (status === 500) return '서버에 문제가 발생했습니다';
    return error.message || '요청 처리 중 오류가 발생했습니다';
  }

  if (error instanceof TypeError) {
    return '네트워크 연결을 확인해 주세요';
  }

  return '알 수 없는 오류가 발생했습니다';
}

function ErrorFallback({
  error,
  mode = 'page',
  onRetry,
  onHome,
}: ErrorFallbackProps) {
  const message = getMessage(error);
  const isPage = mode === 'page';

  return (
    <div
      className={
        isPage
          ? 'flex min-h-[70vh] w-full flex-col items-center justify-center px-6 text-center'
          : 'flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-6 text-center'
      }
      role="alert"
      aria-live="polite"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
        !
      </div>
      <p className="mt-3 text-base font-semibold text-zinc-800">{message}</p>
      {isPage ? (
        <p className="mt-1 text-sm text-zinc-500">
          잠시 후 다시 시도해 주세요.
        </p>
      ) : null}
      <div className="mt-4 flex items-center gap-2">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            다시 시도
          </button>
        ) : null}
        {isPage ? (
          <button
            type="button"
            onClick={onHome ?? (() => (globalThis.location.href = '/'))}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            홈으로
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorFallback;
