import PageContainer from './ui/PageContainer';

function Footer() {
  return (
    <footer className="border-t border-border-default bg-surface-1">
      <PageContainer className="flex flex-col gap-3 py-6 md:flex-row md:items-center md:justify-between">
        <div className="font-LexendDeca text-sm font-semibold">
          <span className="text-brand-primary">Spotlight</span>
          <span className="text-brand-accent">Seoul</span>
        </div>

        <p className="text-xs text-text-muted">
          © {new Date().getFullYear()} SpotlightSeoul. All rights reserved.
        </p>

        <div className="flex gap-3 text-xs text-text-muted">
          <button
            type="button"
            className="rounded-md px-1 py-0.5 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            onClick={() => {
              // 퍼블리싱 단계: 실제 링크는 추후 연결합니다.
            }}
          >
            이용약관
          </button>
          <button
            type="button"
            className="rounded-md px-1 py-0.5 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            onClick={() => {
              // 퍼블리싱 단계: 실제 링크는 추후 연결합니다.
            }}
          >
            개인정보처리방침
          </button>
        </div>
      </PageContainer>
    </footer>
  );
}

export default Footer;
