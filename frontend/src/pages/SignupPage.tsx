import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input, Select } from '@/components/ui';
import {
  SEOUL_GU_OPTIONS,
  mockSignupError,
  mockSignupRequest,
  mockUser,
} from '@/mocks/users';

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

type SignupErrors = {
  username?: string;
  email?: string;
  password?: string;
  location?: string;
  form?: string;
};

function SignupPage() {
  const usernameId = 'signup-username';
  const emailId = 'signup-email';
  const passwordId = 'signup-password';
  const locationId = 'signup-location';

  const [username, setUsername] = useState(mockSignupRequest.username);
  const [email, setEmail] = useState(mockSignupRequest.email);
  const [password, setPassword] = useState(mockSignupRequest.password);
  const [location, setLocation] = useState(mockSignupRequest.location);
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): SignupErrors => {
    const next: SignupErrors = {};

    if (username.trim().length < 2) next.username = '닉네임은 2자 이상이어야 합니다.';
    if (!email.trim()) next.email = '이메일을 입력해주세요.';
    else if (!email.includes('@')) next.email = '이메일 형식을 확인해주세요.';
    if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';
    if (!location) next.location = '지역을 선택해주세요.';

    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);

    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.username) {
      document.getElementById(usernameId)?.focus();
      return;
    }
    if (nextErrors.email) {
      document.getElementById(emailId)?.focus();
      return;
    }
    if (nextErrors.password) {
      document.getElementById(passwordId)?.focus();
      return;
    }
    if (nextErrors.location) {
      document.getElementById(locationId)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      await delay(1000);

      if (email.trim() === mockUser.email) {
        setErrors({ form: mockSignupError.message });
        return;
      }

      console.log('[mock] signup success', {
        username: username.trim(),
        email: email.trim(),
        password: '********',
        location,
      });
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
        <p className="mt-1 text-sm text-text-muted">새 계정 만들기</p>
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
              회원가입이 완료되었습니다.{' '}
              <Link to="/auth/login" className="font-semibold underline">
                로그인으로 이동
              </Link>
              해주세요. (모의)
            </div>
          ) : null}

          <Input
            id={usernameId}
            label="닉네임"
            placeholder="예: 홍길동"
            autoComplete="nickname"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            errorText={errors.username}
            required
            disabled={isSubmitting}
          />

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
            placeholder="8자 이상"
            autoComplete="new-password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            errorText={errors.password}
            required
            disabled={isSubmitting}
          />

          <Select
            id={locationId}
            label="지역"
            placeholder="서울 25개 구"
            options={SEOUL_GU_OPTIONS}
            value={location}
            onChange={(ev) => setLocation(ev.target.value)}
            errorText={errors.location}
            required
            disabled={isSubmitting}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            회원가입
          </Button>

          <p className="text-center text-sm text-text-muted">
            이미 계정이 있나요?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-brand-primary hover:underline"
            >
              로그인
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default SignupPage;
