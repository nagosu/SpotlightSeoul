import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const ACCESS_TOKEN_KEY = 'access_token';

type JwtPayload = {
  id?: string;
  email?: string;
  exp?: number;
  iat?: number;
};

export type AuthUser = {
  id: string;
  email: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  initialize: () => void;
};

function safeGetToken(): string | null {
  try {
    return globalThis.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? null;
  } catch {
    return null;
  }
}

function safeSetToken(token: string): void {
  try {
    globalThis.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
  } catch {
    // localStorage 접근이 불가한 환경이면 저장을 생략합니다.
  }
}

function safeRemoveToken(): void {
  try {
    globalThis.localStorage?.removeItem(ACCESS_TOKEN_KEY);
  } catch {
    // localStorage 접근이 불가한 환경이면 삭제를 생략합니다.
  }
}

function decodeUserFromToken(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token);
    const { id, email, exp } = payload;

    // 만료(exp)가 있으면 만료 토큰은 무효 처리합니다.
    if (typeof exp === 'number') {
      const nowSeconds = Math.floor(Date.now() / 1000);
      if (exp <= nowSeconds) return null;
    }

    if (!id || !email) return null;
    return { id, email };
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const token = safeGetToken();
  const user = token ? decodeUserFromToken(token) : null;

  // 저장된 토큰이 있지만 유효하지 않으면 즉시 정리합니다.
  if (token && !user) safeRemoveToken();

  return {
    isAuthenticated: Boolean(token && user),
    user,
    accessToken: token && user ? token : null,
    login: (newToken) => {
      const decodedUser = decodeUserFromToken(newToken);
      if (!decodedUser) {
        safeRemoveToken();
        set({ isAuthenticated: false, user: null, accessToken: null });
        return;
      }

      safeSetToken(newToken);
      set({
        isAuthenticated: true,
        user: decodedUser,
        accessToken: newToken,
      });
    },
    logout: () => {
      safeRemoveToken();
      set({ isAuthenticated: false, user: null, accessToken: null });
    },
    initialize: () => {
      const stored = safeGetToken();
      const decodedUser = stored ? decodeUserFromToken(stored) : null;

      if (!stored || !decodedUser) {
        if (stored && !decodedUser) safeRemoveToken();
        set({ isAuthenticated: false, user: null, accessToken: null });
        return;
      }

      set({
        isAuthenticated: true,
        user: decodedUser,
        accessToken: stored,
      });
    },
  };
});
