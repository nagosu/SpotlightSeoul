import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import PageContainer from './ui/PageContainer';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function NavBar() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const goExplore = () => {
    navigate('/explore');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-surface-0/90 backdrop-blur">
      <PageContainer className="flex h-14 items-center justify-between gap-3 md:h-16">
        <Link
          to="/"
          className={cx(
            'flex items-baseline gap-0.5 font-LexendDeca text-lg font-extrabold md:text-2xl',
            'rounded-md px-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          )}
          aria-label="홈으로 이동"
        >
          <span className="text-brand-primary">Spotlight</span>
          <span className="text-brand-accent">Seoul</span>
        </Link>

        {/* 검색 진입: 홈에서 즉시 검색 결과 렌더 금지 → /explore 이동 */}
        <button
          type="button"
          onClick={goExplore}
          className={cx(
            'flex h-10 flex-1 items-center gap-2 rounded-control border border-border-default bg-surface-1 px-3 text-left text-sm text-text-muted shadow-soft transition',
            'hover:bg-surface-2',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
          )}
          aria-label="축제 검색으로 이동"
        >
          <span aria-hidden="true">⌕</span>
          <span className="truncate">검색어로 축제를 찾아보세요</span>
        </button>

        <nav className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/mypage')}
                className="h-10 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-strong shadow-soft hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                마이
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="h-10 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-muted shadow-soft hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate('/auth/login')}
                className="h-10 rounded-control bg-brand-primary px-3 text-sm font-semibold text-white shadow-soft hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => navigate('/auth/signup')}
                className="hidden h-10 rounded-control border border-border-default bg-surface-0 px-3 text-sm font-semibold text-text-strong shadow-soft hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 md:inline-flex"
              >
                회원가입
              </button>
            </>
          )}
        </nav>
      </PageContainer>
    </header>
  );
}

export default NavBar;
