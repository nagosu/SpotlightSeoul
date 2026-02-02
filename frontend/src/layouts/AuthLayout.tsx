import { Outlet } from 'react-router-dom';

function AuthLayout() {
  // 인증 전용 레이아웃: Nav/Footer 숨김
  return (
    <div className="min-h-screen">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
