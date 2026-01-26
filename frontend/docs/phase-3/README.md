# Phase 3 — 공통 HTTP 레이어(axios instance) 표준화

## 목표(Why)
- 모든 API 호출을 **단일 HTTP 레이어**로 통일해, 인증/에러/케이스 변환/성공코드 처리 규칙을 “한 번에” 적용합니다.
- 화면/컴포넌트에서 `axios.get/post/...`를 직접 호출하는 패턴을 단계적으로 제거합니다.

## 범위(Scope)
- axios instance 1개를 기준으로 요청/응답 인터셉터 정책을 정의합니다.
- “권장 모듈/파일 분리”를 제시해, 이후 기능 Phase에서 API 함수를 어디에 둘지 확정합니다.

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 2.2 (공통 HTTP 레이어 표준화)
  - 요청 인터셉터: 토큰 있을 때만 Authorization 주입
  - 응답 인터셉터: 성공 변환, 실패 정규화, 401 엔트리포인트
  - 주의: 특정 POST는 201이 성공(로그인/검색)
  - lat/lot 파라미터명 고정
- `frontend/docs/AS-IS.md`: axios 호출이 페이지/컴포넌트에 분산 + `http://localhost:8080` 하드코딩 존재

## 선행조건(Dependencies)
- Phase 1(규칙), Phase 2(baseURL 규칙)

## 권장 모듈/파일 분리(최소 변경 가이드)
원문 2.2의 예시를 그대로 사용합니다(경로/역할을 고정해 혼선을 방지).
- [ ] `src/api/http.ts`: axios instance + request/response interceptor
- [ ] `src/api/festivals.ts`: festival 관련 API 함수(목록/상세/검색/자동완성/내주변/좋아요/북마크)
- [ ] `src/api/users.ts`: users/login/bookmarks API 함수
- [ ] `src/utils/case.ts`: snake_case → camelCase deep 변환 유틸(Phase 4)
- [ ] `src/auth/token.ts`: 토큰 저장/조회/삭제(Phase 7)

## 작업 체크리스트(아주 상세)
### A. axios instance 기본 정책
- [ ] baseURL은 `import.meta.env.VITE_API_BASE_URL`을 사용합니다(Phase 2 규칙 준수).
- [ ] timeout을 정합니다(예: 10~15초). 네트워크 불안정 시 UX를 위해 “무한 대기”를 피합니다.
- [ ] `Content-Type: application/json` 기본값을 사용하되, 파일 업로드(Blob/FormData)는 예외 처리로 분리합니다(현재 범위 밖).

### B. Request interceptor — Authorization 주입(토큰 있을 때만)
- [ ] 토큰 조회 함수(예: `getAccessToken()`)를 통해 토큰을 가져옵니다.
- [ ] 토큰이 있을 때만 `Authorization: Bearer <token>`을 추가합니다.
- [ ] 토큰이 없을 때는 헤더를 만들지 않거나 Authorization을 생략합니다(빈 문자열 금지).

### C. Response interceptor — 성공 응답 처리
- [ ] 2xx는 성공으로 취급합니다.
- [ ] 특히 `POST /api/v1/login`, `POST /api/v1/festivals`는 **201도 성공**으로 처리해야 합니다(원문 2.2 주의).
- [ ] 성공 응답 본문은 **snake_case → camelCase 변환**을 적용합니다(Phase 4 유틸 사용).
  - 규칙: UI/상태/컴포넌트에서 snake_case 사용 금지(Phase 1)

### D. Response interceptor — 실패 응답 정규화(에러 표준)
에러는 화면/훅에서 일관되게 처리할 수 있도록 “표준 형태”로 변환합니다.
- [ ] 네트워크 오류(응답 없음), 타임아웃, CORS 등은 “네트워크 계열”로 분류합니다.
- [ ] HTTP 상태코드(4xx/5xx)는 status를 보존합니다.
- [ ] 권장 표준 에러 형태(예시):
  - `status?: number`
  - `message: string` (사용자 표시용)
  - `code?: string` (서버가 제공하면)
  - `details?: unknown` (디버깅/로그)
  - `isNetworkError: boolean`
  - `isAuthError: boolean` (401/403)

### E. 401 엔트리포인트(로그인 유도 + 작업 복귀)
- [ ] 401 발생 시 “토큰 만료/미인증”으로 간주하고, 다음을 수행할 수 있는 신호를 상위로 올립니다.
  - 토큰 제거/만료 처리(Phase 7 정책)
  - 로그인 화면 이동 및 `returnTo` 보존(Phase 7 정책)
- [ ] 인터셉터에서 “바로 라우팅”할지, “표준 에러로만 반환하고 상위에서 처리”할지 결정합니다.
  - 최소 변경 권장: 인터셉터는 표준 에러만 만들고, 라우팅/UX는 상위(인증/Query 에러 핸들러)에서 처리

### F. API 함수 작성 규칙(후속 Phase 공통)
- [ ] 페이지/컴포넌트에서 직접 axios 호출 금지
- [ ] API 함수는 `src/api/*.ts`에만 둡니다.
- [ ] 엔드포인트 문자열은 Phase 2 규칙을 따릅니다.
  - `VITE_API_BASE_URL`에 `/api/v1` 포함 시, 함수는 `"/festivals"`처럼 prefix 없는 경로 사용

## Definition of Done(DoD)
- “HTTP 호출에 관한 규칙”이 `src/api/http.ts`(또는 동등한 단일 위치)로 모입니다.
- 성공/실패/401의 처리 방식이 문서로 고정되어, 이후 기능 Phase에서 동일한 방식으로 적용할 수 있습니다.

## 검증 방법
- [ ] (문서 검증) 이 README만 보고도 아래를 결정할 수 있는지 확인합니다.
  - baseURL이 어디서 오고, 엔드포인트 문자열을 어떻게 쓰는지
  - 201 성공 처리 규칙이 어디에 적용되는지
  - 401이 어디에서 어떤 형태로 처리되는지(표준 에러 vs 라우팅)
- [ ] (구현 후 검증 예시) DevTools 네트워크 탭에서 요청 URL이 `VITE_API_BASE_URL` 기준으로만 생성되는지 확인합니다.

## 주의/함정
- 인터셉터에서 snake_case 변환을 하지 않으면, 화면에서 snake_case를 섞어 쓰게 되어 유지보수 비용이 급증합니다.
- 401 처리와 라우팅을 인터셉터에서 “즉시” 해버리면, TanStack Query/라우터/컴포넌트 상태와 충돌할 수 있습니다(정책을 먼저 정하고 일관되게 적용해야 합니다).
