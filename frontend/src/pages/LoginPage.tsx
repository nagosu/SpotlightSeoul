import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LogoImg from '../assets/images/png/Logo.png';
import loginApi from '../api/auth';
import { useAuthStore } from '../stores/useAuthStore';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const authLogin = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const v = params.get('returnTo');
    return v && v.startsWith('/') ? v : '/';
  }, [location.search]);

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await loginApi({ email: email.trim(), password });
      authLogin(res.access_token);
      navigate(returnTo, { replace: true });
    } catch (e) {
      // apiClient는 실패 시 ApiError로 정규화합니다.
      const message =
        typeof e === 'object' && e != null && 'message' in e
          ? String((e as { message?: unknown }).message ?? '')
          : '';
      setErrorMessage(
        message || '로그인에 실패했습니다. 입력 정보를 확인해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-loginimg w-full bg-[#ffffff]">
      <div className="flex justify-center">
        <div className="">
          <img
            src={LogoImg}
            alt="login"
            className="flex max-h-screen items-center justify-center"
          />
        </div>
        <div className="ml-10 flex w-72 flex-col justify-center space-y-4 font-LexendDeca">
          <div className="mb-3 text-[30pt] font-medium text-[#06439F]">
            Login
          </div>
          <input
            className="rounded-md bg-[#EAF0F7] px-2 py-2 font-light outline-none "
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            aria-label="이메일"
          />
          <input
            className="rounded-md bg-[#EAF0F7] px-2 py-2 font-light outline-none "
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-label="비밀번호"
          />
          {errorMessage ? (
            <div className="text-sm text-red-600" role="alert">
              {errorMessage}
            </div>
          ) : null}
          <button
            className="rounded-md bg-[#06439F] py-2 font-light text-white disabled:opacity-60"
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
          <button
            className="rounded-md border border-[#06439F] bg-[#ffffff] py-2 font-light text-[#06439F]"
            type="button"
            onClick={() => {
              navigate('/auth/signup');
            }}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
