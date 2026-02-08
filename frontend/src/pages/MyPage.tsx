import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Button,
  EmptyState,
  ErrorState,
  FestivalCard,
  Input,
  Modal,
  PageContainer,
  Pagination,
  SectionHeader,
  Select,
  Skeleton,
  Tabs,
  useToast,
} from '@/components/ui';
import {
  SEOUL_GU_OPTIONS,
  mockBookmarkEmpty,
  mockBookmarkPage,
  mockUser,
} from '@/mocks/users';

type TabKey = 'bookmarks' | 'edit' | 'account';
type SectionStatus = 'loading' | 'success' | 'empty' | 'error';

const TAB_ITEMS: Array<{ key: TabKey; label: string }> = [
  { key: 'bookmarks', label: '북마크' },
  { key: 'edit', label: '프로필 수정' },
  { key: 'account', label: '계정' },
];

const BOOKMARK_PAGE_SIZE = 4;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), ms);
  });
}

function normalizeTab(raw: string | null): TabKey {
  if (raw === 'bookmarks' || raw === 'edit' || raw === 'account') return raw;
  return 'bookmarks';
}

function getInitials(name?: string | null) {
  const trimmed = (name ?? '').trim();
  if (!trimmed) return 'U';
  return trimmed.slice(0, 1).toUpperCase();
}

type EditErrors = {
  username?: string;
  email?: string;
  location?: string;
  password?: string;
  passwordConfirm?: string;
  form?: string;
};

function MyPage() {
  const navigate = useNavigate();
  const { push } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = normalizeTab(searchParams.get('tab'));
  const mockMode = searchParams.get('mock'); // 예: bookmarks-empty | bookmarks-error | profile-error | error

  const [profileStatus, setProfileStatus] = useState<SectionStatus>('loading');
  const [bookmarkStatus, setBookmarkStatus] = useState<SectionStatus>('loading');
  const [bookmarkPage, setBookmarkPage] = useState(1); // 1-based

  const [username, setUsername] = useState(mockUser.username);
  const [email, setEmail] = useState(mockUser.email);
  const [location, setLocation] = useState(mockUser.location);
  const [errors, setErrors] = useState<EditErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const runProfile = useCallback(() => {
    setProfileStatus('loading');
    window.setTimeout(() => {
      if (mockMode === 'profile-error' || mockMode === 'error') {
        setProfileStatus('error');
        return;
      }
      setProfileStatus('success');
    }, 450);
  }, [mockMode]);

  const runBookmarks = useCallback(() => {
    setBookmarkStatus('loading');
    window.setTimeout(() => {
      if (mockMode === 'bookmarks-error' || mockMode === 'error') {
        setBookmarkStatus('error');
        return;
      }

      const page =
        mockMode === 'bookmarks-empty' ? mockBookmarkEmpty : mockBookmarkPage;
      setBookmarkStatus(page.post_responses.length > 0 ? 'success' : 'empty');
    }, 450);
  }, [mockMode]);

  useEffect(() => {
    runProfile();
    runBookmarks();
  }, [runProfile, runBookmarks]);

  useEffect(() => {
    // 탭 변경 시 페이지네이션을 첫 페이지로 복귀합니다.
    setBookmarkPage(1);
  }, [activeTab]);

  const setTab = useCallback(
    (key: string) => {
      const next = normalizeTab(key);
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('tab', next);
      setSearchParams(nextParams, { replace: false });
    },
    [searchParams, setSearchParams],
  );

  const initials = useMemo(() => getInitials(mockUser.username), []);

  const bookmarkPageData = useMemo(() => {
    const page =
      mockMode === 'bookmarks-empty' ? mockBookmarkEmpty : mockBookmarkPage;
    const totalPages = Math.max(1, page.total_page_num || 1);
    const start = (bookmarkPage - 1) * BOOKMARK_PAGE_SIZE;
    const end = start + BOOKMARK_PAGE_SIZE;
    const currentItems = page.post_responses.slice(start, end);
    return { totalPages, currentItems };
  }, [bookmarkPage, mockMode]);

  const validateEdit = useCallback((): EditErrors => {
    const next: EditErrors = {};
    if (username.trim().length < 2) next.username = '닉네임은 2자 이상이어야 합니다.';
    if (!email.trim()) next.email = '이메일을 입력해주세요.';
    else if (!email.includes('@')) next.email = '이메일 형식을 확인해주세요.';
    if (!location) next.location = '지역을 선택해주세요.';

    if (passwordOpen) {
      if (password.length < 8) next.password = '비밀번호는 8자 이상이어야 합니다.';
      if (passwordConfirm !== password)
        next.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return next;
  }, [email, location, password, passwordConfirm, passwordOpen, username]);

  const onSubmitEdit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const nextErrors = validateEdit();
    setErrors(nextErrors);

    if (nextErrors.username) {
      document.getElementById('mypage-username')?.focus();
      return;
    }
    if (nextErrors.email) {
      document.getElementById('mypage-email')?.focus();
      return;
    }
    if (nextErrors.location) {
      document.getElementById('mypage-location')?.focus();
      return;
    }
    if (nextErrors.password) {
      document.getElementById('mypage-password')?.focus();
      return;
    }
    if (nextErrors.passwordConfirm) {
      document.getElementById('mypage-password-confirm')?.focus();
      return;
    }

    setIsSaving(true);
    try {
      await delay(800);
      console.log('[mock] update user', {
        username: username.trim(),
        email: email.trim(),
        location,
        passwordChanged: passwordOpen && Boolean(password),
      });
      push('저장되었습니다. (모의)', 'success');
      setPassword('');
      setPasswordConfirm('');
      setPasswordOpen(false);
    } catch {
      setErrors({ form: '저장에 실패했습니다. 잠시 후 다시 시도해주세요.' });
    } finally {
      setIsSaving(false);
    }
  };

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await delay(900);
      console.log('[mock] delete account', { id: mockUser.id });
      setDeleteOpen(false);
      push('탈퇴가 완료되었습니다. (모의)', 'info');
      navigate('/', { replace: true });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-1">
      <main className="py-8 md:py-10">
        <PageContainer className="space-y-6">
          {/* Profile Header */}
          <section aria-label="프로필">
            <div className="rounded-card border border-border-default bg-surface-0 p-5 shadow-soft">
              {profileStatus === 'loading' ? (
                <div className="space-y-3">
                  <Skeleton variant="text" className="h-5 w-36" />
                  <Skeleton variant="text" className="h-4 w-64" />
                </div>
              ) : profileStatus === 'error' ? (
                <ErrorState
                  title="프로필을 불러올 수 없습니다"
                  description="네트워크 상태를 확인하고 다시 시도해주세요. (모의)"
                  onRetry={runProfile}
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary"
                    aria-hidden="true"
                  >
                    <span className="font-LexendDeca text-lg font-extrabold">
                      {initials}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-LexendDeca text-lg font-bold text-text-strong">
                      {mockUser.username}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-text-muted">
                      {mockUser.email} · {mockUser.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Tabs */}
          <section aria-label="마이페이지 탭">
            <Tabs
              items={TAB_ITEMS}
              activeKey={activeTab}
              onChange={setTab}
              ariaLabel="마이페이지 메뉴"
              idBase="mypage"
            />
          </section>

          {/* Tab Content */}
          {activeTab === 'bookmarks' ? (
            <section
              id="mypage-panel-bookmarks"
              role="tabpanel"
              aria-labelledby="mypage-tab-bookmarks"
              aria-label="내 북마크"
              className="space-y-4"
            >
              <SectionHeader
                title="내 북마크"
                subtitle="관심 있는 축제를 모아볼 수 있어요"
              />

              {bookmarkStatus === 'loading' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {['bm-s-1', 'bm-s-2', 'bm-s-3', 'bm-s-4'].map((k) => (
                    <Skeleton key={k} variant="card" />
                  ))}
                </div>
              ) : bookmarkStatus === 'error' ? (
                <ErrorState
                  title="북마크를 불러올 수 없습니다"
                  description="잠시 후 다시 시도해주세요. (모의)"
                  onRetry={runBookmarks}
                />
              ) : bookmarkStatus === 'empty' ? (
                <EmptyState
                  title="북마크가 없습니다"
                  description="마음에 드는 축제를 북마크해보세요."
                  primaryAction={{
                    label: '축제 둘러보기',
                    onClick: () => navigate('/explore'),
                  }}
                />
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {bookmarkPageData.currentItems.map((f) => (
                      <FestivalCard key={f.id} festival={f} />
                    ))}
                  </div>
                  <Pagination
                    currentPage={bookmarkPage}
                    totalPages={bookmarkPageData.totalPages}
                    onPageChange={(p) => setBookmarkPage(p)}
                    className="pt-2"
                  />
                </>
              )}
            </section>
          ) : null}

          {activeTab === 'edit' ? (
            <section
              id="mypage-panel-edit"
              role="tabpanel"
              aria-labelledby="mypage-tab-edit"
              aria-label="프로필 수정"
              className="space-y-4"
            >
              <SectionHeader
                title="프로필 수정"
                subtitle="닉네임/이메일/지역을 업데이트할 수 있어요"
              />

              <div className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
                <form className="space-y-4" onSubmit={onSubmitEdit}>
                  {errors.form ? (
                    <div
                      role="alert"
                      className="rounded-control border border-[#EF4444] bg-[#FEF2F2] p-3 text-sm text-[#B91C1C]"
                    >
                      {errors.form}
                    </div>
                  ) : null}

                  <Input
                    id="mypage-username"
                    label="닉네임"
                    value={username}
                    onChange={(ev) => setUsername(ev.target.value)}
                    errorText={errors.username}
                    required
                    disabled={isSaving}
                    autoComplete="nickname"
                    placeholder="예: 홍길동"
                  />

                  <Input
                    id="mypage-email"
                    type="email"
                    label="이메일"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    errorText={errors.email}
                    required
                    disabled={isSaving}
                    autoComplete="email"
                    placeholder="you@example.com"
                  />

                  <Select
                    id="mypage-location"
                    label="지역"
                    options={SEOUL_GU_OPTIONS}
                    value={location}
                    onChange={(ev) => setLocation(ev.target.value)}
                    errorText={errors.location}
                    required
                    disabled={isSaving}
                    placeholder="서울 25개 구"
                  />

                  <div className="rounded-control border border-border-default bg-surface-1 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-LexendDeca text-sm font-bold text-text-strong">
                          비밀번호 변경
                        </p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          변경할 때만 입력해주세요.
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        onClick={() => setPasswordOpen((v) => !v)}
                        ariaLabel="비밀번호 변경 섹션 열기"
                        disabled={isSaving}
                      >
                        {passwordOpen ? '닫기' : '열기'}
                      </Button>
                    </div>

                    <div
                      className={cx(
                        'grid grid-cols-1 gap-3 overflow-hidden transition-[max-height,opacity] duration-200',
                        passwordOpen ? 'mt-4 max-h-40 opacity-100' : 'max-h-0 opacity-0',
                      )}
                      aria-hidden={!passwordOpen}
                    >
                      <Input
                        id="mypage-password"
                        type="password"
                        label="새 비밀번호"
                        value={password}
                        onChange={(ev) => setPassword(ev.target.value)}
                        errorText={errors.password}
                        disabled={isSaving || !passwordOpen}
                        placeholder="8자 이상"
                        autoComplete="new-password"
                      />
                      <Input
                        id="mypage-password-confirm"
                        type="password"
                        label="새 비밀번호 확인"
                        value={passwordConfirm}
                        onChange={(ev) => setPasswordConfirm(ev.target.value)}
                        errorText={errors.passwordConfirm}
                        disabled={isSaving || !passwordOpen}
                        placeholder="비밀번호를 다시 입력"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <Button
                      type="submit"
                      className="w-full"
                      loading={isSaving}
                      ariaLabel="프로필 저장"
                    >
                      저장하기
                    </Button>
                  </div>
                </form>
              </div>
            </section>
          ) : null}

          {activeTab === 'account' ? (
            <section
              id="mypage-panel-account"
              role="tabpanel"
              aria-labelledby="mypage-tab-account"
              aria-label="계정"
              className="space-y-4"
            >
              <SectionHeader
                title="계정"
                subtitle="계정 관리 및 탈퇴를 진행할 수 있어요"
              />

              <div className="rounded-card border border-border-default bg-surface-0 p-6 shadow-soft">
                <div className="rounded-control border border-[#EF4444] bg-[#FEF2F2] p-4">
                  <p className="font-LexendDeca text-sm font-bold text-[#991B1B]">
                    위험 영역
                  </p>
                  <p className="mt-1 text-sm text-[#B91C1C]">
                    계정 탈퇴는 되돌릴 수 없습니다. (퍼블리싱 단계에서는 모의 동작)
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setDeleteOpen(true)}
                      ariaLabel="계정 탈퇴"
                    >
                      계정 탈퇴
                    </Button>
                  </div>
                </div>
              </div>

              <Modal
                open={deleteOpen}
                title="정말 탈퇴하시겠어요?"
                onClose={() => {
                  if (isDeleting) return;
                  setDeleteOpen(false);
                }}
              >
                <p className="text-sm text-text-muted">
                  탈퇴하면 북마크와 프로필 정보를 다시 복구할 수 없습니다. (모의)
                </p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setDeleteOpen(false)}
                    disabled={isDeleting}
                  >
                    취소
                  </Button>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={onConfirmDelete}
                    loading={isDeleting}
                    ariaLabel="탈퇴 확정"
                  >
                    탈퇴하기
                  </Button>
                </div>
              </Modal>
            </section>
          ) : null}
        </PageContainer>
      </main>
    </div>
  );
}

export default MyPage;
