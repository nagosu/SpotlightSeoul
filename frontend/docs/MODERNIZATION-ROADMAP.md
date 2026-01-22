# Modernization Roadmap (3~5 Phases)

## 0. 로드맵 작성 기준

- **우선순위 기준**: 운영/보안 → 안정성 → UX → 유지보수성 → 성능/품질 순으로 진행합니다. (근거: `docs/AS-IS.md:L305-L337`, `docs/AS-IS.md:L338-L361`)
- **원칙**: 이 문서는 “대분류 Phase(3~5개)”만 정의합니다. **세부 태스크(티켓/컴포넌트/함수 단위)는 각 Phase 시작 시 재정의**합니다.
- **근거 기반**: 모든 Phase는 As‑Is에서 드러난 사실(파일/라인)을 Evidence로 연결합니다. (근거: `docs/AS-IS.md:L381-L406`)

## 1. Phase 1 ~ Phase N (각 Phase는 아래 템플릿 고정)

### Phase 1: 운영/환경/키/하드코딩 정리(비교 가치 극대화)

- **목표(Why)**:
  - 현재 코드에 **`localhost` 및 외부 키(clientId) 하드코딩**이 존재하여, “과거 vs 현재” 비교에서 가장 명확한 개선 지표가 됩니다.
  - 배포/운영 환경 분리(Dev/Staging/Prod)와 키 관리 기준선을 먼저 세워야 이후 Phase의 변경이 안전해집니다.
- **범위(Scope)**:
  - `src/pages/MainPage.tsx`, `src/pages/DetailPage.tsx`
  - `src/components/NavBar.tsx`, `src/components/FestivalInformation.tsx`
  - `index.html`, `src/components/MapInformation.tsx`
  - `package.json`, `yarn.lock`, `package-lock.json`
- **핵심 산출물(Deliverables)**:
  - “환경변수/키 관리 규칙” 문서(무엇을 env로 관리하는지, 어떤 값이 필수인지)
  - “API baseURL/외부 스크립트 로딩 정책” 문서(정책 수준)
  - 패키지 매니저 단일화 원칙(어느 것을 기준으로 할지) 및 CI/로컬 사용 규칙
- **완료 기준(Definition of Done)**:
  - 코드베이스에서 **`http://localhost:8080`** 하드코딩이 “정의된 정책”에 의해 제거/대체되었음을 확인할 수 있습니다. (비교 기준 문자열) (근거: `docs/AS-IS.md:L369-L374`)
  - **네이버 지도 clientId가 코드/HTML에 직접 노출되지 않는 정책**(및 준수)이 성립합니다. (비교 기준 문자열) (근거: `docs/AS-IS.md:L324-L326`, `index.html:L12-L13`)
  - 지도 스크립트 로딩이 **한 가지 방식으로 일원화**되었음을 정책/구성으로 확인할 수 있습니다. (근거: `docs/AS-IS.md:L307-L322`)
  - 락파일이 **1종만 남고**, 사용 패키지 매니저가 문서/스크립트로 명확해집니다. (근거: `docs/AS-IS.md:L59-L72`)
  - `npm run build`와 `npm run lint`가 실행 가능한 기준선을 갖습니다. (근거: `package.json:L6-L11`)
- **비교 포인트(과거 vs 현재)**:
  - `http://localhost:8080` 등장 수: 과거 5곳 → 현재 0곳(또는 정책상 허용 범위로 축소) (근거: `docs/AS-IS.md:L369-L374`)
  - `ncpClientId=` 등장 수: 과거 2곳 → 현재 0곳(또는 정책상 대체) (근거: `docs/AS-IS.md:L374-L374`)
  - 락파일 혼재: 과거 `yarn.lock`+`package-lock.json` → 현재 1종 (근거: `docs/AS-IS.md:L59-L72`)
- **리스크/분기점(Pivot points)**:
  - **백엔드 엔드포인트가 환경별로 다르지 않거나**, 프론트가 고정된 게이트웨이에 붙어야 한다는 사실이 확인되면: “env 기반 분기” 대신 “단일 baseURL + 런타임 설정(배포 파이프라인)” 중심으로 방향을 바꿉니다. (근거: `docs/AS-IS.md:L280-L282`)
  - 네이버 지도 로딩이 **CDN 스크립트 제약/정책**(예: 반드시 index.html에 있어야 함)으로 결정되면: 컴포넌트 동적 로딩 로직은 유지하되 중복/경합만 제거하는 방향으로 전환합니다. (근거: `docs/AS-IS.md:L307-L322`)
- **근거(Evidence)**:
  - `src/pages/MainPage.tsx:L52-L70` — `http://localhost:8080` 절대 URL 호출 (근거: `docs/AS-IS.md:L280-L282`)
  - `src/pages/DetailPage.tsx:L44-L46` — 상세 API 절대 URL 호출 (근거: `docs/AS-IS.md:L280-L282`)
  - `src/components/NavBar.tsx:L41-L44` — 검색 API 절대 URL 호출 (근거: `docs/AS-IS.md:L274-L278`)
  - `src/components/FestivalInformation.tsx:L45-L47` — 좋아요 API 절대 URL 호출 (근거: `docs/AS-IS.md:L274-L278`)
  - `index.html:L12-L13` — 지도 스크립트 + clientId 하드코딩 (근거: `docs/AS-IS.md:L307-L326`)
  - `src/components/MapInformation.tsx:L60-L66` — 지도 스크립트 동적 로드(중복 가능) (근거: `docs/AS-IS.md:L307-L322`)
  - `yarn.lock:L1-L3`, `package-lock.json:L1-L6` — 락파일 혼재 (근거: `docs/AS-IS.md:L59-L72`)

### Phase 2: 안정성/툴링/규칙(“변경해도 망가지지 않는” 기준선)

- **목표(Why)**:
  - 현 상태는 lint/build 스크립트는 있으나, 설정상 잠재 이슈와(ESLint project 경로) 코드 품질 일관성(타입 중복/any/네비게이션 혼용)이 관찰됩니다.
  - 팀/미래의 내가 안전하게 리팩토링할 수 있도록 “규칙과 기준선”을 먼저 세웁니다.
- **범위(Scope)**:
  - `.eslintrc.cjs`, `.prettierrc`, `tsconfig*.json`
  - `src/RecoilState.ts`, `src/pages/MainPage.tsx`, `src/components/Filter.tsx`, `src/components/NavBar.tsx`
  - `package.json`
- **핵심 산출물(Deliverables)**:
  - “코드 품질 규칙” 문서(타입 정의 위치/중복 금지 원칙, any 사용 기준, 네비게이션 규칙 등)
  - “lint/build 기준선” 문서(어떤 명령이 통과해야 하는지, 실패 시 해석 가이드)
- **완료 기준(Definition of Done)**:
  - ESLint가 프로젝트 tsconfig를 안정적으로 참조한다는 근거(설정/문서)가 존재합니다. (근거: `docs/AS-IS.md:L130-L133`)
  - 동일 도메인 모델 타입이 **중복 정의되지 않는 규칙**이 성립합니다. (근거: `docs/AS-IS.md:L340-L342`)
  - `any` 사용이 “규칙상 금지/예외”로 정리되고, 현재 발견된 `any` 사례에 대한 방침이 명확합니다. (근거: `docs/AS-IS.md:L343-L352`)
  - SPA 네비게이션이 한 방식으로 일관됩니다(규칙/정책 수준). (근거: `docs/AS-IS.md:L354-L356`)
  - 테스트 스크립트 유무가 의사결정에 반영됩니다(추가 여부는 Phase 4로 미룰 수 있음). (근거: `docs/AS-IS.md:L360-L361`)
- **비교 포인트(과거 vs 현재)**:
  - 타입 중복: 과거 `PostCardData` 다중 정의 → 현재 단일 출처 원칙 (근거: `docs/AS-IS.md:L340-L342`)
  - `any` 사용: 과거 1개 이상 → 현재 0개(또는 예외 문서화) (근거: `docs/AS-IS.md:L343-L352`)
  - 네비게이션: 과거 `navigate` + `window.location.href` 혼용 → 현재 1가지 원칙 (근거: `docs/AS-IS.md:L354-L356`)
- **리스크/분기점(Pivot points)**:
  - lint 설정 변경이 예상보다 큰 코드 수정(규칙 위반 폭발)을 유발하면: “엄격화” 대신 “현재 상태를 통과하는 최소 규칙 + 점진 강화”로 방향 전환합니다. (근거: `package.json:L6-L11`, `.eslintrc.cjs:L4-L23`)
  - 기존 tsconfig가 이미 `strict: true`라(엄격함) 타입 정리가 과도한 비용이면: “도메인 핵심 타입부터”로 범위를 축소합니다. (근거: `tsconfig.json:L17-L21`, `docs/AS-IS.md:L340-L342`)
- **근거(Evidence)**:
  - `.eslintrc.cjs:L21-L22` — `parserOptions.project: 'frontend/tsconfig.json'` (근거: `docs/AS-IS.md:L130-L133`)
  - `tsconfig.json:L18-L21` — `strict` 및 noUnused* 옵션 (근거: `docs/AS-IS.md:L76-L78`)
  - `src/RecoilState.ts:L3-L12` + `src/pages/MainPage.tsx:L12-L21` — `PostCardData` 중복 정의 (근거: `docs/AS-IS.md:L340-L342`)
  - `src/components/Filter.tsx:L138-L145` — `any` 사용 (근거: `docs/AS-IS.md:L343-L352`)
  - `src/components/NavBar.tsx:L76-L82` — `window.location.href` 사용 (근거: `docs/AS-IS.md:L354-L356`)
  - `package.json:L6-L11` — test 스크립트 부재 및 lint/build 존재 (근거: `docs/AS-IS.md:L360-L361`)

### Phase 3: UX/플로우 정합성(사용자 경험을 “진짜 동작” 수준으로)

- **목표(Why)**:
  - 현재는 “동작은 하지만(또는 일부만)” UX 정합성이 깨질 수 있는 지점(필터 입력과 상태 연결, 로딩/에러 처리, 로그인/회원가입의 실질 연동 부재)이 보입니다.
  - 과거의 나가 만든 사용 흐름을 “명시적 스펙/정합성”으로 끌어올려, 현재의 나와 비교 가능한 사용자 경험 기준을 만듭니다.
- **범위(Scope)**:
  - `src/pages/MainPage.tsx`, `src/components/Filter.tsx`, `src/components/Paging.tsx`
  - `src/pages/LoginPage.tsx`, `src/pages/SignupPage.tsx`
  - `src/components/NavBar.tsx`
  - `src/pages/DetailPage.tsx`, `src/components/MapInformation.tsx`
- **핵심 산출물(Deliverables)**:
  - “유저 플로우 스펙(문서)” — 목록/상세/검색/필터/인증 흐름의 기대 동작 정의
  - “로딩/에러 UX 규칙” — 최소 로딩 상태/실패 메시지/재시도 정책
- **완료 기준(Definition of Done)**:
  - 필터 UI 입력이 실제 상태/요청 파라미터에 반영된다는 것을 코드로 확인할 수 있습니다. (근거: `docs/AS-IS.md:L357-L359`, `docs/AS-IS.md:L209-L224`)
  - 목록 로딩(무한스크롤/필터/검색)에서 **로딩/에러 상태가 일관된 규칙**을 따릅니다. (근거: `docs/AS-IS.md:L283-L299`)
  - 로그인/회원가입이 “실제 연동 여부(없음/있음)”를 사용자 관점에서 명시할 수 있는 수준으로 정리됩니다(문서/UX). (근거: `docs/AS-IS.md:L246-L249`)
  - 지도 영역이 실제로 렌더링/표시되는지에 대한 기준선(재현/해결)이 확립됩니다. (근거: `docs/AS-IS.md:L334-L336`)
- **비교 포인트(과거 vs 현재)**:
  - 필터: 과거 UI‑state 연결 불완전 → 현재 입력‑상태‑요청의 정합성 확보 (근거: `docs/AS-IS.md:L357-L359`)
  - 에러 처리: 과거 `console.log`/`alert` 중심 → 현재 사용자 친화적 규칙 (근거: `docs/AS-IS.md:L283-L295`)
  - 인증: 과거 단순 navigate → 현재 “명시된 정책/흐름” (근거: `docs/AS-IS.md:L246-L249`)
- **리스크/분기점(Pivot points)**:
  - 필터/검색/목록의 제품 요구사항(정렬/페이지 크기/필터 항목)이 백엔드/기획에 의해 달라진다면: “UI 개선”보다 먼저 “요청 파라미터 계약”을 확정하는 방향으로 전환합니다. (근거: `src/pages/MainPage.tsx:L64-L70`)
  - 지도 구현 이슈가 실제로는 “스크립트 중복 로드”가 원인이면: Phase 1의 정책 확정 후에 UX 개선을 진행하는 방향으로 재정렬합니다. (근거: `docs/AS-IS.md:L307-L322`, `docs/AS-IS.md:L334-L336`)
- **근거(Evidence)**:
  - `src/components/Filter.tsx:L126-L152` — 날짜/세부분야 입력의 상태 반영 불명확 (근거: `docs/AS-IS.md:L357-L359`)
  - `src/pages/MainPage.tsx:L91-L113` — 검색/필터/무한스크롤 분기 로직 (근거: `docs/AS-IS.md:L215-L224`)
  - `src/components/NavBar.tsx:L65-L67` — `alert` 기반 입력 검증 (근거: `docs/AS-IS.md:L283-L295`)
  - `src/pages/LoginPage.tsx:L31-L38`, `src/pages/SignupPage.tsx:L34-L41` — 인증 연동 부재(현재 코드 기준) (근거: `docs/AS-IS.md:L246-L249`)
  - `src/components/MapInformation.tsx:L36-L40` + `src/components/MapInformation.tsx:L79-L81` — 지도 컨테이너 렌더 시점 이슈 가능성 (근거: `docs/AS-IS.md:L334-L336`)

### Phase 4: 데이터 레이어/상태/테스트의 “현대화 후보” 정리(큰 전환은 후순위)

- **목표(Why)**:
  - 현재는 axios 호출이 페이지/컴포넌트에 직접 분산되어 있고, react-query는 의존성만 존재하며 실제 Provider 적용 근거가 없습니다.
  - 큰 전환(react-query 전면 도입 등)은 비교/리스크가 크므로, 앞선 Phase의 기준선 위에서 “도입 여부를 판단 가능한 상태”로 만듭니다.
- **범위(Scope)**:
  - `src/pages/*`, `src/components/*` 중 API 호출이 있는 파일들
  - `src/main.tsx`, `src/App.tsx`
  - `package.json`(의존성/스크립트 확인 수준)
- **핵심 산출물(Deliverables)**:
  - “데이터 패칭 표준” 문서(캐싱/중복 호출/에러/로딩 처리 정책)
  - “react-query 도입 의사결정 기록(ADR)” — 도입/미도입/부분도입을 결정하는 기준
  - “테스트/품질 게이트” 정책 문서(최소 수준의 검증 전략; 구체 구현은 Phase 시작 시 재정의)
- **완료 기준(Definition of Done)**:
  - react-query를 **도입하지 않더라도** 데이터 패칭 정책이 문서화되어 일관 적용 가능 상태입니다. (근거: `docs/AS-IS.md:L274-L304`)
  - react-query를 도입한다면, **Provider 레벨 적용 여부**가 아키텍처로 확인 가능합니다(예: entry/App 레벨). (근거: `docs/AS-IS.md:L301-L304`)
  - 테스트를 도입한다면, `package.json`에 **측정 가능한 실행 기준**이 추가된 상태여야 합니다(스크립트 기준). (근거: `package.json:L6-L11`, `docs/AS-IS.md:L360-L361`)
- **비교 포인트(과거 vs 현재)**:
  - 데이터 호출 위치: 과거 분산(페이지/컴포넌트 직접 axios) → 현재 정책/구조에 의해 통제 가능 (근거: `docs/AS-IS.md:L274-L279`)
  - react-query: 과거 “의존성만 존재” → 현재 “도입 여부가 근거로 설명 가능” (근거: `docs/AS-IS.md:L301-L304`)
  - 테스트: 과거 test 스크립트 부재 → 현재 기준선 명시 (근거: `docs/AS-IS.md:L360-L361`)
- **리스크/분기점(Pivot points)**:
  - API 트래픽/성능 요구가 낮고 개발 속도가 우선이면: react-query 도입을 미루고 “axios 정책 + 최소 구조화”로 유지합니다. (근거: `docs/AS-IS.md:L274-L282`)
  - 반대로 목록/상세/검색에서 **중복 호출/캐싱 필요**가 실제로 확인되면: react-query(또는 동등한 캐싱 레이어) 도입을 Phase 4의 핵심으로 승격합니다. (근거: `docs/AS-IS.md:L5.2-L5.3` 구간의 다중 호출 흐름, `docs/AS-IS.md:L272-L303`)
- **근거(Evidence)**:
  - `package.json:L21-L24` — `react-query` 의존성 존재 (근거: `docs/AS-IS.md:L301-L303`)
  - `src/App.tsx:L9-L21`, `src/main.tsx:L1-L6` — QueryClientProvider 부재(현 상태) (근거: `docs/AS-IS.md:L301-L304`)
  - `docs/AS-IS.md:L274-L304` — API 호출 분산/에러 처리/로딩 처리 스냅샷 (근거: `docs/AS-IS.md:L272-L304`)

## 2. 전체 순서 요약(한 눈에)

- Phase 1에서 **하드코딩(호스트/키/스크립트 로딩/락파일 혼재)**을 정리해 운영 기준선을 먼저 만듭니다.
- Phase 2에서 **툴링/규칙(ESLint·타입·any·네비게이션 정책)**을 확립해 이후 변경의 안정성을 확보합니다.
- Phase 3에서 **사용자 플로우 정합성(필터/로딩·에러/인증/지도 UX)**을 “실제 동작” 수준으로 끌어올립니다.
- Phase 4에서 **데이터 레이어 현대화 후보(react-query 포함)와 테스트/품질 게이트**를 의사결정 가능 상태로 정리하고, 필요 시 도입을 진행합니다.

## 3. 다음 Phase 시작 시 Cursor에게 요청할 “프롬프트 1개”

> “Phase 1(운영/환경/키/하드코딩 정리)을 시작합니다. As‑Is 근거(`docs/AS-IS.md`)를 다시 읽고, 현재 코드에 존재하는 하드코딩 항목(localhost baseURL, ncpClientId, 지도 스크립트 중복 로드, 락파일 혼재)을 기준으로 **세부 태스크를 재정의**해 주세요. 단, 리팩토링/구현 패치는 만들지 말고, (1) 목표/범위/우선순위 (2) 검증 방법 (3) 리스크/분기점 을 포함한 실행 가능한 체크리스트 형태로만 제시해 주세요.”

