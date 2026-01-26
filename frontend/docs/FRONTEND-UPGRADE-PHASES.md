## Frontend 고도화 Phase 로드맵 (API 계약 반영)

> 기준 시점: 2026-01-26  
> 근거(AS-IS): `frontend/docs/AS-IS.md`  
> 근거(API 계약): `GET https://api.spotlight-seoul.shop/api/v1/docs-json` (Swagger UI: `/api/v1/docs`)

## 세분화 Phase 문서(실행 가이드)

> 아래 문서는 이 로드맵을 “작업자가 그대로 수행할 수 있는 체크리스트” 형태로 세분화한 실행 가이드입니다.

- Phase 1: 문서/규칙 고정(결정사항) — [`frontend/docs/phase-1/README.md`](phase-1/README.md)
- Phase 2: 환경변수/베이스URL 정리 — [`frontend/docs/phase-2/README.md`](phase-2/README.md)
- Phase 3: 공통 HTTP 레이어(axios) 표준 — [`frontend/docs/phase-3/README.md`](phase-3/README.md)
- Phase 4: snake_case → camelCase 변환 — [`frontend/docs/phase-4/README.md`](phase-4/README.md)
- Phase 5: 에러/로딩/빈 상태 UI 규칙 — [`frontend/docs/phase-5/README.md`](phase-5/README.md)
- Phase 6: 로그인/회원가입(API 연동) — [`frontend/docs/phase-6/README.md`](phase-6/README.md)
- Phase 7: 인증/토큰/401 복귀 동선 — [`frontend/docs/phase-7/README.md`](phase-7/README.md)
- Phase 8: TanStack Query 표준(키/캐시/401) — [`frontend/docs/phase-8/README.md`](phase-8/README.md)
- Phase 9: 목록 `/festivals` 통합 — [`frontend/docs/phase-9/README.md`](phase-9/README.md)
- Phase 10: 상세 `/festivals/{id}` 정합 — [`frontend/docs/phase-10/README.md`](phase-10/README.md)
- Phase 11: 검색(201 성공) + URL 상태 — [`frontend/docs/phase-11/README.md`](phase-11/README.md)
- Phase 12: 좋아요(레거시→Bearer 토글) — [`frontend/docs/phase-12/README.md`](phase-12/README.md)
- Phase 13: 북마크/내 북마크 — [`frontend/docs/phase-13/README.md`](phase-13/README.md)
- Phase 14: 자동완성(suggest) — [`frontend/docs/phase-14/README.md`](phase-14/README.md)
- Phase 15: 내 주변(near) — [`frontend/docs/phase-15/README.md`](phase-15/README.md)
- Phase 16: 지도(Naver) 키/env화 + 로딩 단일화 — [`frontend/docs/phase-16/README.md`](phase-16/README.md)
- Phase 17: 품질 게이트(스모크/계약/트러블슈팅) — [`frontend/docs/phase-17/README.md`](phase-17/README.md)

## 0. 이 문서의 목적/원칙

- **목적(Why)**: 프론트엔드 고도화를 “작업자가 그대로 따라 할 수 있는 실행 순서(체크리스트)”로 정리하고, 특히 **API 계약 변화**(엔드포인트/파라미터/인증/응답 스키마)를 기준으로 우선순위를 명확히 합니다.
- **원칙**
  - **최소 변경 원칙**: 먼저 “연결/계약/안정성(운영 가능성)”을 맞춘 뒤 UX/구조/성능 개선을 진행합니다.
  - **근거 기반**: 프론트 현 상태(AS-IS)와 OpenAPI 스펙에 근거해 Phase를 정의합니다.
  - **표준화 우선**: 데이터 패칭/에러 처리/인증/반응형/접근성은 “각 화면마다 구현”이 아니라 **공통 규칙과 컴포넌트**로 표준화합니다.
  - **Definition of Done(DoD)**: 각 Phase는 “끝났다고 말할 수 있는” 검증 기준을 갖습니다.

## 1. API 변화 요약(프론트가 반드시 따라가야 하는 핵심)

- **Base URL / Prefix**
  - 기존 프론트는 `http://localhost:8080/api/v1/...` 하드코딩이 존재합니다. (근거: `frontend/docs/AS-IS.md:L280-L282`)
  - 운영 API는 `https://api.spotlight-seoul.shop`이며 prefix는 `/api/v1` 입니다. (근거: OpenAPI paths에 `/api/v1/...` 존재)
- **인증(Bearer JWT)**
  - 로그인: `POST /api/v1/login` → `access_token` 반환
  - 좋아요/북마크 토글, 내 북마크 목록은 **Bearer 인증 필요**입니다.
    - `PUT /api/v1/festivals/{id}/like` (Bearer)
    - `PUT /api/v1/festivals/{id}/bookmark` (Bearer)
    - `GET /api/v1/users/me/bookmarks` (Bearer)
- **목록/검색 계약**
  - 통합 리스트: `GET /api/v1/festivals` (기간/상태/정렬/페이징 포함)
  - 타이틀 검색: `POST /api/v1/festivals` (page/size 쿼리 + body, **성공 시 201**)
  - 자동완성: `GET /api/v1/festivals/suggest`
  - 내 주변: `GET /api/v1/festivals/near` (lat/lot 필수)
- **응답 스키마**
  - 응답은 snake_case가 기본입니다(예: `festival_like`, `total_page_num`). (근거: OpenAPI schema)

## 1.1 프론트 데이터 키 정책(필수 전제)

- **정책(결정)**: 서버의 snake_case 응답은 **프론트 내부 표준인 camelCase로 변환**합니다.
- **원칙**
  - **UI/상태/컴포넌트는 camelCase만 사용**합니다(원본 snake_case를 여기저기 섞지 않습니다).
  - 변환은 “어딘가에서 한 번”만 수행합니다. (권장: 공통 HTTP 레이어의 응답 변환)
  - 예외는 최소화합니다(원본 payload를 그대로 저장/로깅해야 하는 케이스만 명시적으로 허용).
- **대표 변환 예시(OpenAPI 스키마 기준)**
  - `access_token` → `accessToken`
  - `total_page_num` → `totalPageNum`
  - `post_responses` → `postResponses`
  - `festival_like` → `festivalLike`
  - `festival_view` → `festivalView`
  - `main_img` → `mainImg`, `thumb_img` → `thumbImg`
  - `strt_date` → `strtDate`, `end_date` → `endDate`
  - `org_link` → `orgLink`
  - `is_free` → `isFree`
  - `major_code_name` → `majorCodeName`, `gu_name` → `guName`, `sub_code_name` → `subCodeName`
  - `distance_km` → `distanceKm` (내 주변 응답)

## 2. 공통 선행 작업(기능 공통 필수, “여기서 흔들리면 이후가 다 깨짐”)

> 목적: 기능을 붙이기 전에 “환경/HTTP/에러/인증/변환/로딩 규칙”을 **한 번에** 고정합니다.

### 2.1 환경변수/베이스 URL(하드코딩 제거)

- **해야 할 일(순서)**
  - Vite env에 `VITE_API_BASE_URL`을 정의합니다(로컬/스테이징/프로덕션 구분).
    - 현재 `frontend/.env.local`은 `VITE_API_BASE_URL=https://api.spotlight-seoul.shop/api/v1` 형태로 **prefix(`/api/v1`)까지 포함**하고 있습니다.
    - 따라서 코드에서는 엔드포인트를 `/festivals`처럼 **`/api/v1` 없이** 붙여야 `/api/v1/api/v1` 중복을 피할 수 있습니다.
  - 코드에서 `http://localhost:8080` 문자열을 직접 쓰는 호출을 없애고, 공통 baseURL을 통해서만 호출합니다.
- **검증**
  - 로컬 실행 시 `VITE_API_BASE_URL=https://api.spotlight-seoul.shop/api/v1`로 주요 호출이 동작해야 합니다.

### 2.2 공통 HTTP 레이어(axios instance) 표준화

- **해야 할 일(순서)**
  - axios instance 1개를 기준으로 합니다.
  - 요청 인터셉터에서 토큰이 있을 때만 `Authorization: Bearer <token>`을 주입합니다.
  - 응답 인터셉터에서 아래를 수행합니다.
    - 성공 응답: **snake_case → camelCase 변환**
    - 실패 응답: 에러를 표준 형태로 정규화(네트워크/타임아웃/HTTP 상태)
    - 401: “로그인 유도 + 작업 복귀(returnTo)” 엔트리포인트로 연결
- **주의(실전 함정)**

  - OpenAPI에서 `POST /api/v1/festivals`와 `POST /api/v1/login`은 성공 시 **201**이므로, “201도 성공”으로 취급해야 합니다.
  - OpenAPI에서 내 주변 쿼리는 `lat`(위도), `lot`(경도)로 정의되어 있습니다. 흔히 쓰는 `lng`와 혼동하지 않도록 **프론트에서 파라미터명을 고정**합니다.

- **권장 파일/모듈 분리(예시, 최소 변경을 위한 가이드)**
  - `src/api/http.ts`: axios instance + request/response interceptor(토큰 주입, camelCase 변환, 에러 정규화)
  - `src/api/festivals.ts`: festival 관련 API 함수(목록/상세/검색/자동완성/내주변/좋아요/북마크)
  - `src/api/users.ts`: users/login/bookmarks API 함수
  - `src/utils/case.ts`: snake_case → camelCase deep 변환 유틸(배열/중첩 객체 포함)
  - `src/auth/token.ts`: 토큰 저장/조회/삭제(로그아웃 포함)

### 2.2.1 데이터 패칭 표준: TanStack Query로 고정(@tanstack/react-query)

> 결정: API 호출(목록/상세/검색/내주변/자동완성/내북마크/토글)은 **TanStack Query**로 표준화합니다. (axios instance는 queryFn 내부에서 사용)

- **해야 할 일(순서)**
  - 1. 앱 엔트리에 `QueryClientProvider`를 추가하고, 기본 옵션(재시도/캐시)을 정합니다.
  - 2. 모든 API는 “함수(axios 호출) + query/mutation 훅” 형태로 노출합니다.
  - 3. queryKey 규칙을 문서로 고정합니다(캐시 충돌 방지).
    - 예: `['festivals','list', params]`, `['festivals','detail', id]`, `['festivals','suggest', q, limit]`, `['festivals','near', {lat,lot,radiusKm,status,page,size}]`
    - 예: `['auth','me','bookmarks', {page,size}]`
  - 4. 토글류(좋아요/북마크)는 `useMutation`으로 구현하고, 성공 시 캐시를 무효화/갱신합니다.
    - 예: 상세 캐시(`['festivals','detail', id]`)와 목록 캐시(`['festivals','list', ...]`) 중 UX에 필요한 쪽을 invalidate 또는 setQueryData로 동기화
  - 5. 401 처리: axios 인터셉터에서 401을 표준 에러로 만들고, TanStack Query의 에러 경로(onError/ErrorBoundary)에서 로그인 유도/복귀로 연결합니다.
- **DoD**
  - 페이지/컴포넌트에서 `axios.get/post/...`를 직접 호출하지 않고, Query 훅을 통해서만 데이터가 흘러갑니다.
  - 목록/상세/검색이 “중복 요청” 없이 캐시를 재사용하고, 토글 후 UI가 일관되게 업데이트됩니다.

### 2.3 에러/로딩/빈 상태 UI 규칙(재사용 가능한 최소 세트)

- **해야 할 일(순서)**
  - 모든 화면에서 공통으로 쓰는 상태를 최소 세 가지로 통일합니다.
    - `loading`: 스켈레톤/스피너(선택) + 버튼/입력 비활성화
    - `error`: 재시도 버튼 + 사용자가 이해할 수 있는 메시지(네트워크/권한/서버오류)
    - `empty`: “결과 없음” + 다음 행동(필터 해제/검색어 수정)
- **검증**
  - 네트워크 offline(DevTools)에서 목록/상세/검색이 모두 “깨짐” 대신 error 상태로 떨어지는지 확인합니다.

### 2.4 인증 상태/401 엔트리포인트(작업 복귀까지)

- **해야 할 일(순서)**
  - 로그인 성공 시 토큰 저장 위치를 정합니다(기본: 브라우저 저장소. 보안 리스크는 문서로 명시).
  - 401이 발생하면 다음을 수행합니다.
    - 토큰 제거(또는 만료 처리)
    - 로그인 화면으로 이동 + `returnTo`(원래 위치/행동 정보) 보존
    - 로그인 성공 후 `returnTo`로 복귀
- **검증**
  - 비로그인 상태에서 “좋아요/북마크/내 북마크” 실행 시 로그인 유도 → 로그인 후 원래 동작으로 복귀.

## 3. 기능별 고도화 절차(가장 중요: “아주 자세한 순서”)

> 아래는 **현재 코드(AS-IS의 실제 파일)**를 기준으로 “어떤 화면/파일을 어떤 순서로 바꾸는지”를 고정합니다.

### 3.1 목록(메인) — `/api/v1/festivals`로 통합

- **현재(AS-IS)**
  - `src/pages/MainPage.tsx`에서
    - 무한스크롤: `GET /api/v1/festivals/page?offset=&size=` 호출로 누적
    - 필터: `GET /api/v1/festivals/category?...` 호출로 교체 렌더
- **변경 대상 파일(우선순위)**
  - 1순위: `src/pages/MainPage.tsx` (목록 데이터/요청 분기/페이징 상태)
  - 2순위: `src/components/Filter.tsx` (필터 UI ↔ 상태 반영; AS-IS에서 setter 연결 누락 가능성 존재)
  - 3순위: `src/components/Paging.tsx` 또는 페이지네이션 UI 사용처(0-based/1-based 변환)
- **목표(API 계약)**
  - `GET /api/v1/festivals` (200)
  - 파라미터(중요한 것만):
    - `page`(0부터), `size`
    - `status`: `all | upcoming | ongoing | ended`
    - `sort`: `recent | like | view | end_date`
    - `strtDate` / `endDate` (YYYY-MM-DD)
    - `title`, `place`
  - 응답: `{ total_page_num, post_responses: [...] }` → 프론트에서는 `{ totalPageNum, postResponses: [...] }`
  - 서버 설명상 `isFree/majorCodeName/guName/subCodeName`는 “입력만 받고 필터링 미적용”일 수 있으니(스펙 설명), UI/문서에 기대치(“현재 서버에서 미적용 가능”)를 명시합니다.
- **구현 순서(체크리스트)**
  - 1. **쿼리의 단일 진실 원천을 URL로 고정**
    - 필터/정렬/페이지는 URL query로 표현(새로고침/뒤로가기 안정).
  - 2. 목록 API 호출을 `/festivals`로 교체
    - 기존 `/page`, `/category` 호출을 없애고 `/festivals`로 통합합니다.
    - (권장) `src/api/festivals.ts`에 `listFestivals(params)` 형태로 함수화하고, `MainPage`에서는 그 함수만 호출합니다.
    - (TanStack Query) `useQuery({ queryKey: ['festivals','list', params], queryFn })`로 표준화합니다.
  - 3. 페이지네이션 기준을 0-based로 맞추기
    - UI 컴포넌트(페이지네이션 라이브러리)가 1-based라면 “UI↔API 변환”을 문서에 명시합니다.
  - 4. 무한스크롤 유지 여부 결정(최소 변경 권장: 유지)
    - 유지 시: `page`를 증가시키며 `postResponses`를 append.
    - 교체 시: 페이지네이션 UI로 전환(추가 작업).
  - 5. 로딩/에러/빈 상태 적용(2.3 규칙 준수)
- **DoD**
  - `MainPage`에서 더 이상 `http://localhost:8080` 및 `/festivals/page`, `/festivals/category`를 호출하지 않습니다.
  - `status/sort/page/size` 변화가 네트워크 요청으로 반영되고 UI가 일관되게 갱신됩니다.
  - 빈 결과/오류/로딩 상태가 통일된 UX로 표현됩니다.
- **검증(권장)**
  - Swagger UI에서 `GET /api/v1/festivals?status=ongoing&sort=like&page=0&size=20` 실행 결과와 프론트 렌더(개수/필드) 비교

### 3.2 상세 — `GET /api/v1/festivals/{id}` 정합화 + 지도/부가정보

- **현재(AS-IS)**
  - `src/pages/DetailPage.tsx`에서 `GET /api/v1/festivals/:id` 호출 후 여러 state로 분해 저장
  - 지도: `MapInformation`에서 스크립트 로드 이슈/하드코딩 가능성 존재
- **변경 대상 파일(우선순위)**
  - 1순위: `src/pages/DetailPage.tsx` (상세 조회/상태/렌더)
  - 2순위: `src/components/FestivalInformation.tsx` (좋아요/북마크 UI 위치가 여기에 있다면 동시 정리)
  - 3순위: `src/components/MapInformation.tsx`, `index.html` (지도 로딩/키 관리)
- **목표(API 계약)**
  - `GET /api/v1/festivals/{id}` (200, “조회수 +1”)
  - snake_case 필드들(`festival_like`, `festival_view`, `strt_date` 등)은 camelCase로 변환 후 UI에 사용
- **구현 순서(체크리스트)**
  - 1. 상세 응답을 camelCase 모델로 고정
    - (TanStack Query) `useQuery({ queryKey: ['festivals','detail', id], queryFn })`로 표준화합니다.
  - 2. 날짜/좌표/이미지 URL null 가능성을 고려해 렌더 가드(빈 문자열/대체 UI)
  - 3. 지도 컴포넌트는 “lat/lot 존재할 때만” 렌더 + 로딩/오류 처리
- **DoD**
  - 상세 진입 시 스펙 필드가 누락/nullable여도 화면이 깨지지 않습니다.
  - 조회수/좋아요/기간/주소/이미지가 정상 매핑됩니다.
- **검증**
  - Swagger UI에서 동일 id 호출 결과와 프론트 표시가 키 기준으로 일치하는지 확인

### 3.3 검색(타이틀) — `POST /api/v1/festivals`(201) 기반

- **현재(AS-IS)**
  - `src/components/NavBar.tsx`에서 Enter 시 `POST /api/v1/festivals` 호출 후 Recoil에 저장, 메인에서 우선 렌더
- **변경 대상 파일(우선순위)**
  - 1순위: `src/components/NavBar.tsx` (검색 입력/제출/자동완성 연동)
  - 2순위: `src/pages/MainPage.tsx` (검색 결과 렌더 우선순위/목록 통합)
  - 3순위: `src/RecoilState.ts` (검색 상태를 계속 Recoil로 유지할지, URL 쿼리로 전환할지 결정)
- **목표(API 계약)**
  - `POST /api/v1/festivals?page=&size=` (201)
  - body: `{ "title": "서울" }`
  - 응답: `{ total_page_num, post_responses }`
- **구현 순서(체크리스트)**
  - 1. “검색 상태”도 URL query로 표현(예: `?q=서울`)
  - 2. 검색 API 호출은 201도 성공으로 처리
  - 3. 결과 렌더는 “목록 렌더러”를 재사용(검색/일반목록 UI 갈라짐 방지)
    - (TanStack Query) 검색도 list와 같은 렌더러를 쓰되, queryKey를 분리합니다.
      - 예: `['festivals','search', {title, page, size}]`
  - 4. 빈 검색어 UX: alert 대신 인라인 메시지 + 포커스 이동(접근성)
  - 5. 페이지네이션/무한스크롤 정책을 목록과 동일하게 맞춤
- **DoD**
  - 검색어/페이지가 URL에 반영되고 새로고침에도 상태가 유지됩니다.
  - 201 응답을 정상 처리하며, 빈 결과/오류가 일관 UX로 표현됩니다.
- **검증**
  - Swagger UI에서 `POST /api/v1/festivals` 예시(`title=서울`)와 프론트 결과 비교

### 3.4 인증(로그인/회원가입) — 토큰 발급/저장/복귀 동선

- **현재(AS-IS)**: 로그인/회원가입은 화면 이동만 존재 (근거: `frontend/docs/AS-IS.md:L246-L249`)
- **변경 대상 파일(우선순위)**
  - 1순위: `src/pages/LoginPage.tsx` (실제 로그인 연동)
  - 2순위: `src/pages/SignupPage.tsx` (회원가입 연동)
  - 3순위: `src/App.tsx` (보호 라우트/returnTo 처리 진입점이 필요하면)
- **목표(API 계약)**
  - 회원가입: `POST /api/v1/users` (201)
  - 로그인: `POST /api/v1/login` (201) → `{ access_token }` → 프론트 `{ accessToken }`
- **추가로 고려할 화면(스펙 추가분, 권장)**
  - 마이페이지/프로필 편집: `PUT /api/v1/users` (회원수정) → 신규 페이지 예: `src/pages/MyPage.tsx` 또는 `src/pages/ProfileEditPage.tsx` + 라우팅 `src/App.tsx`
  - 회원 탈퇴(계정 삭제): `DELETE /api/v1/users/{id}` (204) → 신규 페이지 예: `src/pages/AccountDeletePage.tsx`(또는 마이페이지 내부 섹션)
- **구현 순서(체크리스트)**
  - 1. 로그인 폼 validation(이메일/비밀번호) + 제출 중 중복 클릭 방지
  - 2. 로그인 성공 시 토큰 저장 + 전역 로그인 상태 갱신
  - 3. `returnTo`가 있으면 복귀, 없으면 홈으로
  - 4. 회원가입 성공 후 로그인 화면 유도(또는 자동 로그인 정책 결정)
- **DoD**
  - 로그인 후 Bearer 필요 API가 정상 동작합니다.
  - 401 발생 시 로그인 유도 및 작업 복귀가 동작합니다.
- **검증**
  - Swagger UI에서 `Authorize`에 토큰을 넣어본 뒤, 프론트에서도 같은 API가 성공하는지 비교

### 3.5 좋아요 — “+1 레거시”에서 “Bearer 토글”로 일원화

- **현재(AS-IS)**: `PUT /api/v1/festivals/likes/{id}`로 좋아요 +1 구현이 존재
- **변경 대상 파일(우선순위)**
  - 1순위: `src/components/FestivalInformation.tsx` (좋아요 버튼/카운트/요청)
  - 2순위: `src/pages/DetailPage.tsx` (상세 응답과 버튼 상태(liked) 결합 방식)
- **목표(API 계약)**
  - 권장(최종): `PUT /api/v1/festivals/{id}/like` (Bearer, 200) → `{ festival_like, liked }`
  - 레거시(과도기): `PUT /api/v1/festivals/likes/{id}` (200) → `{ festival_like }`
- **구현 순서(체크리스트)**
  - 1. (과도기) 기존 +1 유지하면서 UI/상태를 camelCase 기준으로 정리
  - 2. 로그인 기능이 붙으면 Bearer 토글로 전환
  - 3. 토글 전환 시 UX:
    - 비로그인: 로그인 유도
    - 로그인: optimistic update(선택) + 실패 시 롤백
    - (TanStack Query) 토글은 `useMutation`으로 처리하고 성공 시 관련 queryKey를 invalidate 또는 `setQueryData`로 즉시 반영합니다.
- **DoD**
  - 최종적으로 좋아요는 토글 API로만 동작하고, 응답의 `festivalLike/liked`가 UI에 반영됩니다.
- **검증**
  - 토큰 없음/있음 케이스로 401 및 정상 토글 여부 확인

### 3.6 북마크/내 북마크 — 보호 기능 + 목록 연동

- **목표(API 계약)**
  - 토글: `PUT /api/v1/festivals/{id}/bookmark` (Bearer, 200) → `{ bookmarked }`
  - 내 북마크: `GET /api/v1/users/me/bookmarks?page=&size=` (Bearer, 200) → `FestivalPageResponse`
- **변경 대상(신규 포함)**
  - 신규 페이지(권장): `src/pages/BookmarksPage.tsx` 또는 기존 구조에 맞는 페이지 파일
  - 라우팅 추가 필요: `src/App.tsx`
  - 북마크 토글 UI 위치: `DetailPage` 또는 카드 컴포넌트(`PostCard`) 중 선택
- **구현 순서(체크리스트)**
  - 1. 북마크 토글 UI는 상세(또는 카드)에서 제공할 위치를 정함
  - 2. 토큰 없으면 로그인 유도 + 복귀
  - 3. “내 북마크” 화면/진입점 추가(보호 라우트)
  - 3.1) (TanStack Query) 내 북마크는 `useQuery({ queryKey: ['auth','me','bookmarks', {page,size}], ... })`로 구현합니다.
  - 4. 북마크 초기 상태 전략을 정함(중요)
    - 옵션 A(정확): 내 북마크 목록을 캐시하고 id 포함 여부로 초기 표시
    - 옵션 B(단순): 최초에는 미확정 상태로 두고 토글 후에만 반영(UX 저하 가능)
- **DoD**
  - 내 북마크 화면에서 페이징 조회가 가능하고, 토글 결과가 즉시 UI에 반영됩니다.
- **검증**
  - Swagger `Authorize`로 동일 API 호출 결과와 프론트 UI 비교

### 3.7 자동완성 — `GET /api/v1/festivals/suggest`

- **목표(API 계약)**
  - `GET /api/v1/festivals/suggest?q=&limit=` (200) → `{ suggestions: string[] }`
- **구현 순서(체크리스트)**
  - 1. 입력 디바운스(예: 200~300ms) + 요청 취소(최신 입력만 반영)
  - 2. IME(한글 조합) 입력 중 과도 호출 방지
  - 3. 키보드 탐색(↑/↓/Enter/Esc) 지원 + aria 적용
- **DoD**
  - 자동완성이 과도 호출 없이 동작하고, 선택 시 검색으로 자연스럽게 연결됩니다.
- **검증**
  - `q=서울`로 호출 시 Swagger 예시와 동일한 형태로 표시되는지 확인

### 3.8 내 주변 — `GET /api/v1/festivals/near`

- **목표(API 계약)**
  - `GET /api/v1/festivals/near?lat=&lot=&radius_km=&status=&page=&size=` (200)
  - 응답: `FestivalNearPageResponse` (각 항목에 `distance_km`)
- **구현 순서(체크리스트)**
  - 1. 위치 권한 요청 UX(허용/거부/실패) 설계
  - 2. 권한 거부 시 폴백(예: 안내 문구 + 수동 검색/기본 목록 유도)
  - 3. 결과 리스트에는 거리 표시(`distanceKm`) 포함
- **DoD**
  - 권한 시나리오별로 깨지지 않고, 정상 시 거리순 목록이 표시됩니다.
- **검증**
  - 브라우저 위치 권한 허용/거부로 각각 확인

### 3.9 지도(Naver) — 스크립트 로딩 단일화 + 키 env화

- **현재(AS-IS)**
  - `index.html` 전역 로드 + `MapInformation` 동적 로드 로직이 중복될 수 있고, clientId 하드코딩이 존재합니다. (근거: `frontend/docs/AS-IS.md:L307-L326`)
- **변경 대상 파일**
  - `index.html` (전역 스크립트 로드 정책)
  - `src/components/MapInformation.tsx` (동적 로드/초기화/렌더 타이밍)
- **구현 순서(체크리스트)**
  - 1. 로딩 방식을 하나로 단일화(전역 로드 또는 런타임 로드 중 하나)
  - 2. clientId를 env로 분리(`VITE_NAVER_MAP_CLIENT_ID` 등)
  - 3. 컨테이너 렌더 타이밍 보장(지도 div가 존재한 뒤 init)
  - 4. 실패 시 대체 UI(지도 로드 실패, 좌표 없음)
- **DoD**
  - 지도는 한 번만 로드되고, 키가 코드에 하드코딩되어 있지 않으며, 실패해도 상세 화면이 죽지 않습니다.

## 4. 품질 게이트/검증 시나리오(문서에 그대로 복붙 가능한 체크리스트)

### 4.1 기능 스모크 체크리스트(권장 순서)

- [ ] 목록: `GET /festivals` 호출, 로딩/빈결과/오류 UI 확인
- [ ] 상세: `GET /festivals/{id}` 호출, nullable 필드에서도 렌더 안정
- [ ] 검색: `POST /festivals`(201) 성공 처리, 결과 렌더/페이지 이동 정합
- [ ] 로그인: `POST /login`(201) 후 토큰 저장/복귀 동선
- [ ] 좋아요/북마크: 비로그인 401 → 로그인 유도 → 재시도/복귀
- [ ] 내 북마크: `GET /users/me/bookmarks` 페이징 정상
- [ ] 자동완성: 디바운스/키보드 탐색
- [ ] 내 주변: 권한 허용/거부 UX, 거리 표시
- [ ] 지도: 중복 로드 없음, 실패/좌표 없음 처리

### 4.2 권장 명령(품질 기준선)

- `npm run lint`
- `npm run build`
- (선택) `npm run dev` 후 네트워크 탭에서 baseURL/상태코드 확인

### 4.3 401/에러/변환 정책 점검(운영에서 가장 자주 터지는 부분)

- **401(미인증/만료)**
  - [ ] Bearer 필요한 API에서 401이 오면 로그인 화면으로 이동하고 `returnTo`가 유지됩니다.
  - [ ] 로그인 성공 후 `returnTo`로 복귀하며, “원래 하려던 동작”(좋아요/북마크 등)이 재시도되거나 사용자가 재시도할 수 있습니다.
- **네트워크/서버 오류**
  - [ ] 네트워크 오류(offline/timeout)는 “재시도 가능” 메시지와 함께 error 상태로 표시됩니다.
  - [ ] 5xx는 “잠시 후 다시 시도” 안내가 표시되고, 앱 전체가 크래시하지 않습니다.
- **snake_case → camelCase 변환**
  - [ ] UI/상태/컴포넌트에서 snake_case 키를 직접 참조하는 코드가 없다는 전제를 지킵니다.
  - [ ] 배열/중첩 객체에서도 변환이 적용됩니다(예: `post_responses[]` 내부의 `main_img`, `sub_code_name` 등).
  - [ ] 파일/바이너리 응답(Blob 등)을 다루게 될 경우 변환 대상에서 제외합니다(향후 확장 포인트로 문서에 명시).

### 4.4 `lint`/`build` 실패 시 우선 확인(AS-IS 기반)

- **패키지 매니저/락파일 혼재**
  - AS-IS 기준 `yarn.lock`와 `package-lock.json`이 동시에 존재합니다. 재현성을 위해 “한 가지”로 통일이 필요합니다.
- **ESLint `parserOptions.project` 경로**
  - AS-IS 기준 `.eslintrc.cjs`의 `parserOptions.project`가 경로 이슈를 만들 수 있습니다.
  - 증상: `npm run lint`에서 `Parsing error: Cannot read file ... tsconfig.json` 류 오류

## 5. 추천 작업 순서(WBS, 그대로 수행하면 되는 순서)

- 1. 공통 선행(환경변수/HTTP/에러/401/camelCase 변환) 확정
- 2. 목록(메인) `/festivals` 통합 → 상세 `/festivals/{id}` 정합
- 3. 검색(201 처리) + 자동완성(입력 UX)
- 4. 로그인/회원가입 → (권장) 마이페이지/회원수정/탈퇴 → 좋아요/북마크 토글 → 내 북마크
- 5. 내 주변(권한/거리 표시) + 지도 정리
- 6. 접근성/반응형/에러바운더리/관측 + 품질 게이트 고정

## 6. 체크리스트(스펙 기준으로 프론트가 따라가야 할 엔드포인트)

- **Health**
  - `GET /api/v1` (기본 응답)
  - `GET /api/v1/health` (헬스체크)
  - `GET /api/v1/health/ready` (레디니스)
- **Festival**
  - `GET /api/v1/festivals` (통합 리스트)
  - `POST /api/v1/festivals` (타이틀 검색, 201)
  - `GET /api/v1/festivals/{id}` (상세)
  - `GET /api/v1/festivals/suggest` (자동완성)
  - `GET /api/v1/festivals/near` (내 주변)
  - (옵션) `GET /api/v1/festivals/likes` (좋아요 많은 순, 대체: `GET /api/v1/festivals?sort=like`)
  - (옵션) `GET /api/v1/festivals/views` (조회수 많은 순, 대체: `GET /api/v1/festivals?sort=view`)
  - `PUT /api/v1/festivals/{id}/like` (Bearer, 토글)
  - `PUT /api/v1/festivals/{id}/bookmark` (Bearer, 토글)
  - (레거시) `PUT /api/v1/festivals/likes/{id}` (좋아요 +1)
  - (레거시) `GET /api/v1/festivals/page` (offset 기반)
  - (레거시) `GET /api/v1/festivals/category` (필터)
- **User**
  - `POST /api/v1/users` (회원가입, 201)
  - (추가) `PUT /api/v1/users` (회원수정)
  - `POST /api/v1/login` (로그인, 201)
  - `GET /api/v1/users/me/bookmarks` (Bearer)
  - (추가) `GET /api/v1/users/{userId}` (Bearer, 회원조회)
  - (추가) `DELETE /api/v1/users/{id}` (회원삭제(소프트삭제), 204)
- **Admin**
  - (옵션/관리자용) `GET /api/v1/admin/open-data/status` (Seoul Open API 수집 상태)

## 7. 남은 리스크/추가 확인 포인트(짧게)

- 스펙 설명상 일부 필터 파라미터(`isFree`, `majorCodeName`, `guName`, `subCodeName`)는 “현재 서버에서 필터링 미적용” 가능성이 있으므로, 프론트 UX/문서에 기대치를 명시해야 합니다.
- 좋아요는 “레거시 +1”과 “Bearer 토글”이 공존합니다. 최종 목표(토글 일원화)와 과도기 전략(로그인 전/후)을 문서대로 고정해야 혼선이 없습니다.
