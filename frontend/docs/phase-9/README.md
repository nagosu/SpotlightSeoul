# Phase 9 — 목록(메인) `/festivals` 통합

## 목표(Why)
- 기존에 나뉘어 있던 목록 호출(레거시 page/category)을 **`GET /api/v1/festivals` 하나로 통합**합니다.
- 필터/정렬/페이지 상태를 URL query로 고정해 새로고침/뒤로가기에도 안정적인 목록 UX를 만듭니다.

## 범위(Scope)
- 대상 화면/파일(원문 기준): `src/pages/MainPage.tsx`, `src/components/Filter.tsx`, `src/components/Paging.tsx`(또는 페이지네이션 사용처)
- API: `GET /api/v1/festivals` (200)
- 파라미터: `page`(0-based), `size`, `status`, `sort`, `strtDate/endDate`, `title`, `place` (+ 서버 미적용 가능 파라미터의 UX 표기)

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 3.1(목록 통합)
- 필터 미적용 가능성: 3.1 및 7(리스크)

## 선행조건(Dependencies)
- Phase 3(HTTP), Phase 8(Query), Phase 5(상태 UX)

## 작업 체크리스트(아주 상세)
### A. URL query를 “단일 진실 원천”으로 고정(원문 3.1)
- [ ] 목록 상태(필터/정렬/페이지/사이즈)를 URL query로 표현합니다.
- [ ] 뒤로가기/새로고침 시에도 동일 상태가 재현되어야 합니다.
- [ ] query 파라미터 이름/기본값을 문서로 고정합니다.
  - 예: `status=all`, `sort=recent`, `page=0`, `size=20`

### B. 0-based page 규칙 적용(원문 3.1)
- [ ] API `page`는 0부터 시작합니다.
- [ ] UI 페이지네이션이 1-based인 경우, 변환 규칙을 문서에 명시합니다.
  - UI 표시: 1…N
  - API 요청: `page = uiPage - 1`

### C. API 호출을 `/festivals`로 통합(레거시 제거)
- [ ] 기존 레거시 호출을 제거합니다.
  - 레거시: `GET /api/v1/festivals/page` (offset 기반)
  - 레거시: `GET /api/v1/festivals/category` (필터)
- [ ] 통합 API: `GET /api/v1/festivals`로만 호출되도록 만듭니다.
- [ ] Query 표준에 맞춰 queryKey를 고정합니다.
  - 예: `['festivals','list', params]`

### D. 목록 렌더러 재사용(검색/내북마크/내주변과 일관성)
- [ ] “카드/리스트 UI”는 가능한 한 한 가지 컴포넌트로 재사용합니다.
- [ ] 목록/검색/내북마크/내주변이 같은 타입의 아이템을 렌더하도록 문서에 명시합니다.

### E. 로딩/에러/빈 상태 적용(Phase 5)
- [ ] 로딩 중 스켈레톤/스피너(선택) + 입력 비활성화
- [ ] 오류 시 재시도 버튼 및 안내 문구
- [ ] 빈 결과 시 “필터 해제/검색 수정” 행동 제공

### F. 서버 미적용 가능 필터(리스크) UX 표기(원문 3.1, 7)
원문은 일부 필터 파라미터가 서버에서 “입력만 받고 필터링 미적용”일 수 있음을 명시합니다.
- [ ] 대상 파라미터(문서에 명시): `isFree`, `majorCodeName`, `guName`, `subCodeName`
- [ ] UX/문서에 아래 중 하나로 기대치를 명시합니다.
  - 옵션 A: 해당 필터는 “현재 서버에서 미적용일 수 있음” 안내 배지/툴팁 표시
  - 옵션 B: 서버 적용 확인 전까지 UI에서 숨김(기능 플래그)
  - 옵션 C: UI는 유지하되, 결과가 변하지 않을 수 있음을 설명(지원 문의/이슈 링크)

## Definition of Done(DoD)
- `MainPage`는 더 이상 레거시 `/festivals/page`, `/festivals/category`를 호출하지 않습니다(원문 DoD).
- `status/sort/page/size` 변경이 네트워크 요청과 UI에 일관되게 반영됩니다.
- 로딩/오류/빈 결과 UX가 통일되어 있고, 필터 미적용 가능성에 대한 기대치가 문서/UX에 명시되어 있습니다.

## 검증 방법
- [ ] Swagger UI에서 `GET /api/v1/festivals?status=ongoing&sort=like&page=0&size=20` 결과와 프론트 렌더가 일치하는지 비교합니다(원문 3.1 검증).
- [ ] URL query를 바꾸며(페이지/정렬/필터) 뒤로가기/새로고침에도 상태가 유지되는지 확인합니다.
- [ ] 네트워크 offline에서 `error` UI로 정상 전환되는지 확인합니다(Phase 5/원문 2.3).

## 주의/함정
- page 0-based 규칙을 놓치면 페이지네이션이 한 칸씩 밀립니다.
- 서버 미적용 필터를 UI에서 “적용되는 것처럼” 보이게 하면 사용자 불신을 키웁니다. 반드시 기대치를 명시해야 합니다.
