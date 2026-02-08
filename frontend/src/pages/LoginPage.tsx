import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { mockLoginError, mockLoginRequest, mockLoginResponse } from '@/mocks/users';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

type LoginErrors = {
  email?: string;
  password?: string;
  form?: string;
};

function LoginPage() {
  const emailId = 'login-email';
  const passwordId = 'login-password';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): LoginErrors => {
    const next: LoginErrors = {};
    if (!email.trim()) next.email = '이메일을 입력해주세요.';
    if (!password) next.password = '비밀번호를 입력해주세요.';
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.email) {
      document.getElementById(emailId)?.focus();
      return;
    }
    if (nextErrors.password) {
      document.getElementById(passwordId)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await delay(1000);

      const ok =
        email.trim() === mockLoginRequest.email && password === mockLoginRequest.password;

      if (!ok) {
        setErrors({ form: mockLoginError.message });
        return;
      }

      console.log('[mock] login success', mockLoginResponse);
      setErrors({});
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="text-center">
        <h1 className="font-LexendDeca text-3xl font-semibold text-brand-primary">
          SpotlightSeoul
        </h1>
        <p className="mt-1 text-sm text-text-muted">서울의 축제를 한눈에</p>
      </header>

      <section className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errors.form ? (
            <div
              role="alert"
              className="rounded-control border border-[#EF4444] bg-[#FEF2F2] p-3 text-sm text-[#B91C1C]"
            >
              {errors.form}
            </div>
          ) : null}

          {isSuccess ? (
            <div className="rounded-control border border-[#10B981] bg-[#ECFDF5] p-3 text-sm text-[#065F46]">
              로그인에 성공했습니다. (모의)
            </div>
          ) : null}

          <Input
            id={emailId}
            type="email"
            label="이메일"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            errorText={errors.email}
            required
            disabled={isSubmitting}
          />

          <Input
            id={passwordId}
            type="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            autoComplete="current-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            errorText={errors.password}
            required
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            로그인
          </Button>

          <p className="text-center text-sm text-text-muted">
            계정이 없나요?{' '}
            <Link
              to="/auth/signup"
              className="font-semibold text-brand-primary hover:underline"
            >
              회원가입
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default LoginPage;
