## Frontend 고도화 Phase 로드맵 (API 계약 반영)

> 기준 시점: 2026-01-26  
> 근거(AS-IS): `frontend/docs/AS-IS.md`  
> 근거(API 계약): `GET https://api.spotlight-seoul.shop/api/v1/docs-json` (Swagger UI: `/api/v1/docs`)

## 0. 이 문서의 목적/원칙

- **목적(Why)**: 프론트엔드 고도화를 “Phase 순서”로 정리하고, 특히 **API 계약 변화**(엔드포인트/파라미터/인증/응답 형태)를 기준으로 작업 우선순위를 명확히 합니다.
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
  - 타이틀 검색: `POST /api/v1/festivals` (page/size 쿼리 + body)
  - 자동완성: `GET /api/v1/festivals/suggest`
  - 내 주변: `GET /api/v1/festivals/near` (lat/lot 필수)
- **응답 스키마**
  - 응답은 snake_case가 기본입니다(예: `festival_like`, `total_page_num`). (근거: OpenAPI schema)

## 2. Phase 1: 연결/환경/네트워크 기준선(“API가 바뀌어도 덜 깨지게”)

- **목표(Why)**: API baseURL 하드코딩 제거, 인증 헤더/에러 처리/타입을 한 곳에서 통제할 수 있는 “기준선”을 만듭니다.
- **범위(Scope)**
  - API baseURL/엔드포인트 호출부 정리(현 상태: 페이지/컴포넌트에 axios 직접 호출 분산). (근거: `frontend/docs/AS-IS.md:L168-L170`, `frontend/docs/AS-IS.md:L274-L279`)
  - Vite env 기반 설정(`VITE_API_BASE_URL` 등)
  - 공통 HTTP 레이어(axios instance + interceptor) 또는 최소한의 fetch wrapper
  - 개발 경험(DX) 기반 다지기(고도화가 “지속 가능”하게):
    - 락파일/패키지 매니저 혼재 정리(재현성 확보). (근거: `frontend/docs/AS-IS.md:L59-L72`)
    - ESLint/TS 설정이 실제 실행 환경에서 안정적으로 동작하도록 기준선 확립(예: `parserOptions.project` 경로). (근거: `frontend/docs/AS-IS.md:L130-L133`)
- **핵심 산출물(Deliverables)**
  - `API_BASE_URL`을 env로 관리하는 규칙(Dev/Staging/Prod)
  - 공통 요청 유틸:
    - baseURL 적용
    - Bearer 토큰 주입(있을 때만)
    - 표준 에러 변환(네트워크/401/500)
  - OpenAPI 스키마 기준 타입 정의 전략(수동/부분 자동화)
  - “프론트 품질 게이트” 최소 기준 문서:
    - 어떤 명령이 반드시 통과해야 하는지(`lint`, `build`, (선택) smoke)와 실패 시 해석 가이드
- **완료 기준(DoD)**
  - 코드베이스에서 `http://localhost:8080` 하드코딩 호출이 제거되었음을 확인합니다. (AS-IS 비교 지표 활용)
  - `Authorization: Bearer <token>`을 요구하는 API 호출이 공통 레이어를 통해 동작할 수 있습니다(토큰 없으면 401 처리 포함).
  - 로컬/CI 어디서 실행해도 `lint`/`build`가 “동일한 방식”으로 재현 가능하다는 기준선이 성립합니다(패키지 매니저/락파일 포함).
- **검증 방법**
  - 로컬: `VITE_API_BASE_URL=https://api.spotlight-seoul.shop`로 실행 후 주요 API가 정상 호출되는지 확인
  - 스펙 확인: Swagger UI(`/api/v1/docs`)에서 엔드포인트/파라미터/응답 키 확인
  - `npm run lint`, `npm run build`가 안정적으로 실행되는지 확인(에러가 난다면 설정/경로/락파일 이슈부터 해결)

## 3. Phase 2: 목록/상세/검색을 “최신 계약”으로 정합화(기능 핵심 루프)

- **목표(Why)**: 사용자가 체감하는 핵심 루프(목록→상세, 검색, 필터)를 최신 API 계약에 맞게 동작시키고, 로딩/에러/빈 상태를 일관되게 만듭니다.
- **범위(Scope)**
  - **목록(메인)**
    - `GET /api/v1/festivals`로 통합(기존 `/page`, `/category` 의존은 단계적으로 제거/축소)
    - page/size/status/sort/기간(strtDate/endDate)/title/place 등 쿼리 반영
  - **상세**
    - `GET /api/v1/festivals/{id}` (조회수 +1 포함) 계약에 맞춰 렌더
  - **검색**
    - `POST /api/v1/festivals` (body: `{ title }`, query: page/size)
  - 데이터 레이어(1차 표준화):
    - 캐싱/중복요청/리트라이/로딩 상태의 표준을 정하고 적용
    - 선택지:
      - `react-query`를 실제로 도입(Provider + 쿼리 훅)해 표준화
      - 또는 도입하지 않는 대신 “axios 기반 표준”을 문서/유틸로 강제
- **핵심 산출물(Deliverables)**
  - 목록/상세/검색 요청 파라미터를 “URL 쿼리(딥링크)” 중심으로 정리(뒤로가기/새로고침 정합성)
  - 로딩/에러/빈결과 UI 컴포넌트(최소 공통)
  - OpenAPI 스키마 기반의 응답 타입(예: `FestivalPageResponse`, `FestivalDetailResponse`) 적용
  - 데이터 패칭 표준(캐싱/중복/에러/로딩) 문서 + 코드로 강제되는 최소 구조(훅/유틸)
- **완료 기준(DoD)**
  - 목록: `GET /festivals`로 페이지 이동/정렬/상태 필터가 실제 응답에 의해 갱신됩니다.
  - 검색: 검색어로 `POST /festivals` 호출 후 결과 목록이 표시됩니다(빈 결과 포함).
  - 상세: 상세 진입 시 응답 필드(snake_case)를 정상 매핑하여 화면에 렌더됩니다.
  - 같은 화면에서 “동일 요청”이 불필요하게 중복 호출되지 않으며(정책 기준), 실패/재시도 UX가 일관됩니다.
- **검증 방법**
  - Swagger에서 동일 요청을 실행(또는 curl)하고, 프론트 결과와 `post_responses/total_page_num` 일치 여부를 확인
  - 동일 조건에서 새로고침/뒤로가기/페이지 전환 시 데이터/로딩 UX가 일관되는지 확인

## 4. Phase 3: 인증(로그인/토큰) + 유저 기능(좋아요/북마크/내 북마크)

- **목표(Why)**: 기존 프론트의 로그인/회원가입은 “이동만” 존재했으므로(AS-IS), 최신 API의 인증 모델을 도입해 유저 기능을 실제로 동작시킵니다. (근거: `frontend/docs/AS-IS.md:L246-L249`)
- **범위(Scope)**
  - 로그인: `POST /api/v1/login` → `access_token` 저장(보안/만료 전략 포함)
  - 회원가입: `POST /api/v1/users`
  - 좋아요/북마크 토글:
    - `PUT /api/v1/festivals/{id}/like` (Bearer)
    - `PUT /api/v1/festivals/{id}/bookmark` (Bearer)
  - 내 북마크 목록: `GET /api/v1/users/me/bookmarks` (Bearer)
  - 보호 라우트/권한 UX:
    - “로그인해야 가능한 기능”의 진입 제어(예: 내 북마크 페이지/토글 동작)
    - 401 발생 시 로그인 유도 및 복귀 동선(원래 하려던 작업으로 돌아오기)
- **핵심 산출물(Deliverables)**
  - 인증 상태 모델(로그인 여부/토큰/401 시 처리)
  - 토큰 저장 전략 문서화
    - 기본: 브라우저 저장소 사용 시 XSS 리스크/대응(최소한의 가이드 포함)
  - 401 UX: 로그인 유도, 작업 재시도 동선
  - 로그아웃/토큰 만료 대응(최소): 토큰 제거, 사용자 상태 초기화, 보호 리소스 재요청 정책
- **완료 기준(DoD)**
  - 로그인 후 Bearer가 필요한 API가 성공(200)하며, 실패 시 401 처리 UX가 동작합니다.
  - 상세 화면에서 좋아요/북마크 토글이 응답(`liked`, `festival_like`, `bookmarked`)에 의해 UI에 반영됩니다.
  - 비로그인 상태에서 보호 기능을 수행하려 하면 “막히는 이유/다음 행동(로그인)”이 명확합니다.
- **검증 방법**
  - Swagger UI에서 `Authorize`로 토큰을 넣고 동일 API를 호출해 프론트 동작과 비교
  - 토큰 없음/만료/잘못된 토큰 케이스에서 401 UX가 깨지지 않는지 확인

## 5. Phase 4: 고급 탐색(자동완성/내 주변) + UX 정합성/접근성/품질 게이트

- **목표(Why)**: “탐색 경험”을 강화하고, **반응형(모바일~데스크톱) 완성**과 함께 고도화가 누적돼도 유지보수 가능한 품질 게이트를 갖춥니다.
- **범위(Scope)**
  - 자동완성: `GET /api/v1/festivals/suggest?q=&limit=`
  - 내 주변: `GET /api/v1/festivals/near?lat=&lot=&radius_km=&status=&page=&size=`
  - UX/품질:
    - 로딩/에러/빈상태 일관화(Phase 2 산출물을 확장)
    - 반응형 UI(브레이크포인트/레이아웃/터치 타겟/가독성) 정합화 + “규칙화(시스템화)”
    - 기본 접근성(키보드 탐색, 입력 폼 라벨, aria 필요한 곳)
    - 성능/체감 개선(필요 시):
      - 라우트 단위 코드 스플리팅(lazy)
      - 이미지 로딩/사이즈 최적화(레이아웃 시프트/대체 텍스트 포함)
      - 지도 등 외부 스크립트 로딩 정책(중복 로드/초기 로드 비용) 점검
    - 관측(운영 디버깅 가능성):
      - Error Boundary(런타임 크래시 방지) + 최소한의 오류/요청 로깅 표준
    - 테스트/검증(최소 smoke 수준) 및 CI에서 실행 가능한 기준 수립(Phase 1 기준을 강화)
- **완료 기준(DoD)**
  - 자동완성: 입력 시 suggestion이 표시되고 선택 시 검색/목록에 반영됩니다.
  - 내 주변: 위치 권한/거부/오류 케이스가 UX로 처리되며, 정상일 때 거리순 목록이 표시됩니다.
  - 반응형: 주요 화면(메인/상세/로그인/회원가입)에서 모바일~데스크톱 해상도에서 레이아웃 깨짐 없이 사용 가능하며, 스크롤/클릭(터치) 동선이 자연스럽습니다.
    - “대표 브레이크포인트”와 “레이아웃 규칙(컨테이너 폭/그리드/카드 최소 폭/텍스트 줄바꿈)”이 문서 또는 공통 컴포넌트로 고정돼 있습니다.
  - 접근성: 키보드만으로 핵심 플로우가 가능하고(포커스 이동/Enter/ESC), 입력 요소는 라벨/에러 메시지 연결이 일관됩니다.
  - 성능: 체감 저하가 있는 구간(초기 로드/상세 진입/지도 렌더 등)에서 “원인과 개선”이 설명 가능하며, 최소 1개 이상 개선이 반영됩니다(필요 시).
  - 관측: 예외가 발생해도 전체 앱이 하얗게 죽지 않고(Error Boundary), 사용자가 다음 행동을 선택할 수 있습니다(재시도/홈 이동 등).
  - 품질 게이트: 최소한 `lint`/`build`가 통과하고, 핵심 플로우 1~2개의 smoke 테스트(선택)가 실행 가능합니다.
- **검증 방법**
  - 브라우저에서 위치 권한 허용/거부 시나리오 체크
  - 브라우저 DevTools에서 대표 뷰포트(모바일/태블릿/데스크톱)로 레이아웃/오버플로우/터치 영역 점검
  - 키보드만으로 주요 플로우 점검(Tab/Shift+Tab/Enter/Esc)
  - 네트워크 느린 환경(DevTools Throttling)에서 초기 로드/상세/지도 로딩 체감 점검(필요 시)
  - `npm run build`, `npm run lint` 통과 확인

## 6. 체크리스트(스펙 기준으로 프론트가 따라가야 할 엔드포인트)

- **Festival**
  - `GET /api/v1/festivals` (통합 리스트)
  - `POST /api/v1/festivals` (타이틀 검색)
  - `GET /api/v1/festivals/{id}` (상세)
  - `GET /api/v1/festivals/suggest` (자동완성)
  - `GET /api/v1/festivals/near` (내 주변)
  - `PUT /api/v1/festivals/{id}/like` (Bearer, 토글)
  - `PUT /api/v1/festivals/{id}/bookmark` (Bearer, 토글)
- **User**
  - `POST /api/v1/users` (회원가입)
  - `POST /api/v1/login` (로그인)
  - `GET /api/v1/users/me/bookmarks` (Bearer)

## 7. 남은 리스크/추가 확인 포인트(짧게)

- **MCP로 OpenAPI를 직접 질의**하려면, 현재 환경에서 `spotlight-seoul-openapi` 서버가 실제로 로드되는지 확인이 필요합니다(현재 워크스페이스의 MCP 목록에는 없음).
- **snake_case 응답**을 프론트 모델/컴포넌트에서 어떻게 다룰지(그대로 사용 vs camelCase 변환) 정책 결정을 Phase 1에서 확정하는 것이 안전합니다.
- **react-query 의존성**이 존재하는데 실제 적용이 없다면(Provider 부재 등), “도입 vs 제거” 결정을 Phase 2에서 확정하는 것이 유지보수에 유리합니다.
