# Phase 8 — TanStack Query 표준(도입/키/캐시 전략)

## 목표(Why)
- API 호출을 “컴포넌트 내부 axios 호출”이 아니라 **Query/Mutaion 훅**으로 표준화합니다.
- 중복 요청을 줄이고, 캐시/재시도/로딩/에러 흐름을 일관되게 만듭니다.

## 범위(Scope)
- QueryClientProvider 도입(엔트리 레벨)
- queryKey 규칙 고정
- mutation(좋아요/북마크) 후 캐시 동기화 정책(invalidate/setQueryData)
- 401 에러 경로 처리(onError/ErrorBoundary) 연결 정책

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 2.2.1(TanStack Query 결정), 4.1(스모크), 4.3(401/에러 정책)

## 선행조건(Dependencies)
- Phase 3(HTTP 레이어), Phase 5(상태 UX), Phase 7(401 엔트리포인트)

## 작업 체크리스트(아주 상세)
### A. “어떤 Query 라이브러리를 쓸지” 확인(현 상태 vs 목표)
- [ ] 원문은 `@tanstack/react-query`(TanStack Query)를 사용하자고 명시합니다.
- [ ] 현재 프로젝트는 의존성에 `react-query`(구버전 계열)가 존재합니다(AS-IS 근거).
- [ ] 구현 시점에 아래 중 하나로 결정하고, 결정 이유를 README에 남깁니다.
  - 옵션 A: 현 의존성(`react-query`)을 유지하고, 동일 컨셉으로 표준화(추가 변경 최소)
  - 옵션 B: `@tanstack/react-query`로 마이그레이션하고 표준화(원문 결정 준수)

### B. QueryClientProvider 적용 범위
- [ ] 앱 엔트리에 Provider를 추가합니다(예: `src/main.tsx` 또는 `src/App.tsx`).
- [ ] 기본 옵션을 정합니다(재시도/캐시/리패치 정책).
  - 예: 네트워크 오류만 제한적으로 재시도
  - 예: 페이지 전환 시 과도한 refetch 방지(staleTime 설정)

### C. queryKey 규칙 고정(원문 2.2.1)
키는 “캐시 충돌 방지”를 위해 규칙으로 고정합니다.
- [ ] 목록: `['festivals','list', params]`
- [ ] 상세: `['festivals','detail', id]`
- [ ] 자동완성: `['festivals','suggest', q, limit]`
- [ ] 내 주변: `['festivals','near', {lat,lot,radiusKm,status,page,size}]`
- [ ] 내 북마크: `['auth','me','bookmarks', {page,size}]`
- [ ] 검색: `['festivals','search', {title, page, size}]`

### D. mutation(토글) 후 캐시 동기화 전략(원문 2.2.1)
- [ ] 좋아요/북마크는 `useMutation`으로 구현합니다.
- [ ] 성공 시 다음 중 하나(또는 혼합)로 UI를 즉시 일관되게 맞춥니다.
  - `invalidateQueries`로 관련 목록/상세 캐시를 무효화
  - `setQueryData`로 상세/목록 캐시를 즉시 수정(optimistic 또는 서버 응답 반영)
- [ ] 어떤 queryKey를 갱신할지 문서에 명시합니다.
  - 예: 상세 캐시(`['festivals','detail', id]`)는 반드시 동기화
  - 예: 목록 캐시(`['festivals','list', ...]`)는 UX 필요시만 동기화

### E. 401 처리 연결(원문 2.2.1, 4.3)
- [ ] HTTP 레이어에서 401을 “표준 에러”로 만들고,
- [ ] Query 레이어에서 에러 경로(onError/ErrorBoundary)로 받아 로그인 유도/복귀 정책(Phase 7)을 실행합니다.

## Definition of Done(DoD)
- 페이지/컴포넌트에서 `axios.get/post/...`를 직접 호출하지 않고, Query 훅을 통해서만 데이터가 흐릅니다(원문 2.2.1 DoD).
- 목록/상세/검색이 캐시를 재사용하고, 토글 후 UI가 일관되게 업데이트됩니다.

## 검증 방법
- [ ] 동일 화면을 반복 진입했을 때 불필요한 중복 요청이 줄어드는지 확인합니다(DevTools 네트워크 탭).
- [ ] 좋아요/북마크 토글 후 상세/목록 UI가 모순 없이 바뀌는지 확인합니다.
- [ ] 401 발생 시 Query 에러 경로를 통해 로그인 유도 및 복귀가 동작하는지 확인합니다.

## 주의/함정
- queryKey 규칙이 흔들리면 캐시 충돌/유실이 생깁니다. 키는 “규칙”으로 고정해야 합니다.
- 토글류는 invalidate만으로도 충분할 수 있지만, UX가 느리다면 setQueryData(optimistic 포함)를 고려해야 합니다(선택 기준을 문서화하세요).
