import { Outlet } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer';

function AuthLayout() {
  // 인증 전용 레이아웃: Nav/Footer 숨김
  return (
    <div className="min-h-screen bg-surface-1">
      <main className="min-h-screen pt-8 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <PageContainer className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

export default AuthLayout;
