import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import type { ApiError } from '../api/types/common';
import { useAuthStore } from '../stores/useAuthStore';

let authRedirectInProgress = false;

function isApiError(error: unknown): error is ApiError {
  if (!error || typeof error !== 'object') return false;
  const e = error as Record<string, unknown>;
  return (
    typeof e.statusCode === 'number' &&
    typeof e.code === 'string' &&
    typeof e.message === 'string'
  );
}

function getReturnToFromLocation(): string | null {
  try {
    const { pathname, search, hash } = globalThis.location;
    return `${pathname}${search}${hash}`;
  } catch {
    return null;
  }
}

function isAuthRoute(): boolean {
  try {
    return globalThis.location.pathname.startsWith('/auth/');
  } catch {
    return false;
  }
}

// 401이면 토큰을 정리하고 로그인으로 유도합니다.
function handleAuthError(error: unknown): void {
  if (!isApiError(error)) return;
  if (error.statusCode !== 401 && error.httpStatus !== 401) return;

  // 이미 인증 페이지라면 리다이렉트 루프를 피합니다.
  if (isAuthRoute()) {
    useAuthStore.getState().logout();
    return;
  }

  // 여러 요청이 동시에 401이 나도 한 번만 처리합니다.
  if (authRedirectInProgress) return;
  authRedirectInProgress = true;

  useAuthStore.getState().logout();

  const returnTo = getReturnToFromLocation();
  const params = returnTo ? new URLSearchParams({ returnTo }) : null;
  const qs = params ? `?${params.toString()}` : '';
  globalThis.location.href = `/auth/login${qs}`;
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleAuthError }),
  mutationCache: new MutationCache({ onError: handleAuthError }),
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30초
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          isApiError(error) &&
          (error.statusCode === 401 || error.httpStatus === 401)
        )
          return false;
        return failureCount < 1;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

export default queryClient;
