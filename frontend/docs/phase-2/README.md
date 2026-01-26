# Phase 2 — 환경변수/베이스URL 정리(하드코딩 제거)

## 목표(Why)
- `http://localhost:8080` 하드코딩을 제거하고, **환경변수 기반**으로 API base URL을 통일합니다.
- `/api/v1` prefix 중복(`/api/v1/api/v1`) 같은 실수를 원천 차단합니다.

## 범위(Scope)
- Vite env(`VITE_*`) 기반의 baseURL 규칙을 확정하고 코드 적용 준비를 합니다.
- 이 Phase에서 실제 호출부 교체(대규모 수정)는 Phase 3(HTTP 레이어)부터 진행합니다.

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 2.1 (환경변수/베이스 URL)  
- `frontend/docs/AS-IS.md`에 `http://localhost:8080` 하드코딩 다수 존재
- 현재 `frontend/.env.local`에 `VITE_API_BASE_URL=https://api.spotlight-seoul.shop/api/v1` (prefix 포함)로 기재되어 있음 (원문 2.1)

## 선행조건(Dependencies)
- Phase 1 완료(규칙 고정)

## 작업 체크리스트(아주 상세)
### A. baseURL “정의 위치/형태” 확정
- [ ] `VITE_API_BASE_URL`에 **prefix(`/api/v1`)까지 포함**할지 여부를 확정합니다.
  - 원문은 `.env.local` 예시가 `.../api/v1`까지 포함하는 형태입니다.
- [ ] (권장/원문 기준) `VITE_API_BASE_URL=https://api.spotlight-seoul.shop/api/v1`처럼 **prefix 포함**으로 고정합니다.

### B. 엔드포인트 문자열 규칙 확정(중요)
- [ ] `VITE_API_BASE_URL`에 `/api/v1`이 포함된 경우:
  - API 함수는 `"/festivals"`처럼 **`/api/v1` 없이** 작성합니다.
  - 금지: `"/api/v1/festivals"` (중복 위험)
- [ ] `VITE_API_BASE_URL`에 `/api/v1`이 포함되지 않은 경우(선택지):
  - API 함수는 `"/api/v1/festivals"`처럼 **prefix 포함**으로 작성해야 합니다.
- [ ] 위 규칙을 **모든 README(특히 Phase 3 HTTP 레이어)**에 반복 표기합니다.

### C. 하드코딩 탐지/제거 체크리스트
- [ ] 레포에서 `http://localhost:8080` 문자열을 검색합니다.
  - (권장 명령) `rg "http://localhost:8080" frontend/src`
- [ ] 검색된 파일/라인을 Phase 3에서 교체 대상으로 목록화합니다.
  - 현재 AS-IS 기준 주요 위치(예시): `src/pages/MainPage.tsx`, `src/pages/DetailPage.tsx`, `src/components/NavBar.tsx`, `src/components/FestivalInformation.tsx`

### D. 환경별 실행 규칙(로컬/스테이징/프로덕션) 문서화
- [ ] 로컬 개발 시 어떤 env 파일을 쓰는지 명시합니다(Vite 규칙).
  - 예: `.env.local`(개발자 로컬), `.env.production`(배포), `.env`(공통)
- [ ] `.env.local`은 기본적으로 커밋하지 않습니다(비밀정보 위험).
  - baseURL 자체는 비밀이 아니지만, 같은 파일에 키/토큰이 들어갈 수 있어 관례적으로 제외합니다.
- [ ] “문서에서 사용자에게 토큰/키를 붙여넣게 요구하지 않는다”를 명시합니다.

## Definition of Done(DoD)
- baseURL은 `VITE_API_BASE_URL` 단일 값으로 정의되며, 엔드포인트 문자열 규칙이 문서로 고정되어 있습니다.
- 코드베이스에 남아 있는 `http://localhost:8080` 하드코딩 위치가 “교체 대상 목록”으로 정리되어 있습니다.

## 검증 방법
- [ ] `frontend/.env.local` 기준으로 `VITE_API_BASE_URL` 값이 `/api/v1` 포함인지 확인합니다.
- [ ] `rg "http://localhost:8080" frontend/src` 결과를 확인해 “교체 대상”이 문서에 반영됐는지 확인합니다.

## 주의/함정
- `VITE_API_BASE_URL`에 `/api/v1`이 포함되어 있는데 엔드포인트에도 `/api/v1`을 붙이면 **중복 경로**가 생깁니다.
- baseURL을 여러 곳에서 정의하면(페이지마다, 컴포넌트마다) 이후 Phase(HTTP/에러/인증) 표준화가 실패합니다.
