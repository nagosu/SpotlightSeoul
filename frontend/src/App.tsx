import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import MainPage from './pages/MainPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ExplorePage from './pages/ExplorePage';
import NearbyPage from './pages/NearbyPage';
import MyPage from './pages/MyPage';
import Layout from './layouts/Layout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSpinner from './components/GlobalSpinner';
import { ToastProvider } from './components/ui';
import queryClient from './lib/queryClient';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* 기본 레이아웃 (Nav+Footer) */}
                <Route element={<Layout />}>
                  <Route path="/" element={<MainPage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/nearby" element={<NearbyPage />} />
                  <Route path="/festivals/:id" element={<DetailPage />} />
                  <Route
                    path="/mypage"
                    element={
                      <ProtectedRoute>
                        <MyPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* 인증 레이아웃 (Nav+Footer 숨김) */}
                <Route element={<AuthLayout />}>
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/signup" element={<SignupPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </RecoilRoot>

        <GlobalSpinner />
        {import.meta.env.DEV ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
