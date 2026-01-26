# Phase 17 — 품질 게이트(스모크/명령/정책/계약 점검 + 운영 리스크)

## 목표(Why)
- 기능이 “동작하는 것처럼 보이지만 운영에서 터지는 문제”를 줄이기 위해, 릴리즈 전 통과해야 하는 **품질 게이트**를 고정합니다.
- 스웨거 계약(엔드포인트/상태코드/인증)과 프론트 동작이 일치하는지 반복 검증합니다.

## 범위(Scope)
- 기능 스모크 체크리스트(원문 4.1)
- 권장 명령(`lint/build/dev`) (원문 4.2)
- 401/에러/변환 정책 점검(원문 4.3)
- `lint/build` 실패 트러블슈팅(원문 4.4)
- “프론트가 따라가야 할 엔드포인트” 계약 점검표(원문 6)
- WBS의 “접근성/반응형/에러바운더리/관측” 항목을 최소 체크리스트로 포함(원문 5)

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 4.x, 5, 6

## 선행조건(Dependencies)
- Phase 1~16 완료(또는 최소: 목록/상세/검색/로그인/토글/내북마크/자동완성/내주변/지도 완료)

## 작업 체크리스트(아주 상세)
### A. 기능 스모크 체크리스트(원문 4.1)
- [ ] 목록: `GET /festivals` 호출, 로딩/빈결과/오류 UI 확인
- [ ] 상세: `GET /festivals/{id}` 호출, nullable 필드에서도 렌더 안정
- [ ] 검색: `POST /festivals`(201) 성공 처리, 결과 렌더/페이지 이동 정합
- [ ] 로그인: `POST /login`(201) 후 토큰 저장/복귀 동선
- [ ] 좋아요/북마크: 비로그인 401 → 로그인 유도 → 재시도/복귀
- [ ] 내 북마크: `GET /users/me/bookmarks` 페이징 정상
- [ ] 자동완성: 디바운스/키보드 탐색
- [ ] 내 주변: 권한 허용/거부 UX, 거리 표시
- [ ] 지도: 중복 로드 없음, 실패/좌표 없음 처리

### B. 권장 명령(원문 4.2)
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] (선택) `npm run dev` 후 네트워크 탭에서 baseURL/상태코드 확인

### C. 401/에러/변환 정책 점검(원문 4.3)
- **401(미인증/만료)**
  - [ ] Bearer 필요한 API에서 401이 오면 로그인 화면으로 이동하고 `returnTo`가 유지됩니다.
  - [ ] 로그인 성공 후 `returnTo`로 복귀하며, “원래 하려던 동작”(좋아요/북마크 등)이 재시도되거나 사용자가 재시도할 수 있습니다.
- **네트워크/서버 오류**
  - [ ] 네트워크 오류(offline/timeout)는 “재시도 가능” 메시지와 함께 error 상태로 표시됩니다.
  - [ ] 5xx는 “잠시 후 다시 시도” 안내가 표시되고, 앱 전체가 크래시하지 않습니다.
- **snake_case → camelCase 변환**
  - [ ] UI/상태/컴포넌트에서 snake_case 키를 직접 참조하지 않습니다.
  - [ ] 배열/중첩 객체에서도 변환이 적용됩니다.
  - [ ] Blob/바이너리 응답이 도입되면 변환 대상에서 제외합니다(정책 문서화).

### D. `lint/build` 실패 시 우선 확인(원문 4.4)
- [ ] **락파일 혼재**
  - `yarn.lock`와 `package-lock.json`이 동시에 존재할 수 있습니다.
  - 재현성을 위해 한 가지로 통일하는 작업이 필요할 수 있음을 문서에 남깁니다.
- [ ] **ESLint `parserOptions.project` 경로**
  - `npm run lint`에서 `Parsing error: Cannot read file ... tsconfig.json` 류가 나면 `.eslintrc.cjs`의 경로를 우선 확인합니다.

### E. 엔드포인트 계약 점검표(원문 6)
> 아래 목록은 “프론트가 따라가야 할 엔드포인트” 기준선입니다.
- **Health**
  - [ ] `GET /api/v1`
  - [ ] `GET /api/v1/health`
  - [ ] `GET /api/v1/health/ready`
- **Festival**
  - [ ] `GET /api/v1/festivals` (통합 리스트)
  - [ ] `POST /api/v1/festivals` (타이틀 검색, 201)
  - [ ] `GET /api/v1/festivals/{id}` (상세)
  - [ ] `GET /api/v1/festivals/suggest` (자동완성)
  - [ ] `GET /api/v1/festivals/near` (내 주변)
  - [ ] (옵션) `GET /api/v1/festivals/likes` (좋아요 많은 순)
  - [ ] (옵션) `GET /api/v1/festivals/views` (조회수 많은 순)
  - [ ] `PUT /api/v1/festivals/{id}/like` (Bearer, 토글)
  - [ ] `PUT /api/v1/festivals/{id}/bookmark` (Bearer, 토글)
  - [ ] (레거시) `PUT /api/v1/festivals/likes/{id}` (좋아요 +1)
  - [ ] (레거시) `GET /api/v1/festivals/page` (offset 기반)
  - [ ] (레거시) `GET /api/v1/festivals/category` (필터)
- **User**
  - [ ] `POST /api/v1/users` (회원가입, 201)
  - [ ] (추가) `PUT /api/v1/users` (회원수정)
  - [ ] `POST /api/v1/login` (로그인, 201)
  - [ ] `GET /api/v1/users/me/bookmarks` (Bearer)
  - [ ] (추가) `GET /api/v1/users/{userId}` (Bearer, 회원조회)
  - [ ] (추가) `DELETE /api/v1/users/{id}` (회원삭제(소프트삭제), 204)
- **Admin**
  - [ ] (옵션/관리자용) `GET /api/v1/admin/open-data/status`

### F. 접근성/반응형/에러바운더리/관측(원문 5의 품질 축)
> 이 프로젝트 범위에서 “과도한 도입” 없이 최소 기준만 고정합니다.
- **접근성(A11y)**
  - [ ] 키보드로 주요 기능(검색/자동완성/토글/페이지 이동)을 수행할 수 있습니다.
  - [ ] 폼 에러/네트워크 에러가 시각적으로만 전달되지 않습니다(텍스트 + 포커스).
- **반응형**
  - [ ] 모바일 뷰에서 핵심 화면(목록/상세/검색)이 레이아웃 붕괴 없이 보입니다.
- **에러바운더리**
  - [ ] 예상치 못한 런타임 에러 시 앱 전체가 빈 화면이 되지 않고, 최소한의 안내/복구 경로가 존재합니다.
- **관측/로깅(최소)**
  - [ ] 치명 에러(예: 401 루프, 지도 로드 실패)는 콘솔 로그만이 아니라 추적 가능한 형태로 남길지(옵션) 결정하고 문서화합니다.

## Definition of Done(DoD)
- 위 체크리스트를 통과하면 “운영에서 자주 터지는 문제(401/네트워크/변환/빌드)”의 기본 방어선이 확보됩니다.

## 검증 방법
- [ ] 스모크 체크리스트를 실제로 수행하고, 발견된 이슈는 링크/스크린샷/재현 단계로 기록합니다.
- [ ] `npm run lint`/`npm run build`를 통과합니다.

## 주의/함정
- 품질 게이트를 “마지막에 한 번”만 하면 늦습니다. 기능 Phase가 끝날 때마다 부분적으로라도 통과 여부를 확인해야 합니다.
