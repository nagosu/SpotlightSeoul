# Phase 11 — 검색(타이틀) `POST /festivals`(201) + URL 상태 고정

## 목표(Why)
- 기존 검색 로직(상단바 Enter → 결과를 전역 상태에 저장)을 API 계약(201 성공)과 일치시키고,
- 검색 상태를 URL query로 고정해 새로고침/공유/뒤로가기에서 안정적으로 동작하게 합니다.

## 범위(Scope)
- API: `POST /api/v1/festivals?page=&size=` (201), body: `{ "title": "..." }`
- 대상 파일(원문 기준): `src/components/NavBar.tsx`, `src/pages/MainPage.tsx`, `src/RecoilState.ts`(상태 유지 방식 결정)
- 자동완성은 Phase 14에서 별도로 진행합니다.

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 3.3(검색), 2.2 주의(201 성공)

## 선행조건(Dependencies)
- Phase 8(Query), Phase 5(상태 UX)

## 작업 체크리스트(아주 상세)
### A. 검색 상태를 URL query로 표현(원문 3.3)
- [ ] 예: `?q=서울`
- [ ] 새로고침 시에도 동일 검색 결과가 재요청/재현됩니다.
- [ ] 검색어가 비었을 때는 alert 대신 인라인 메시지 + 포커스 이동(접근성)으로 처리합니다(원문 3.3).

### B. 201 성공 처리(필수)
- [ ] `POST /festivals`는 성공 시 201이므로, 201을 에러로 취급하지 않도록 합니다(원문 2.2 주의).

### C. 목록 렌더러 재사용(원문 3.3)
- [ ] 검색 결과도 “목록 카드/리스트 UI”를 그대로 재사용합니다.
- [ ] Query key를 분리해 캐시 충돌을 방지합니다.
  - 예: `['festivals','search', {title, page, size}]`

### D. 페이지네이션/무한스크롤 정책 일치
- [ ] 검색 결과도 목록과 같은 정책(무한스크롤 또는 페이지네이션)을 사용하도록 정리합니다.
- [ ] page 0-based 규칙을 준수합니다(Phase 1/9).

### E. 전역 상태(Recoil) 유지 여부 결정
- [ ] 원문은 “Recoil 유지 vs URL 전환”을 결정 항목으로 둡니다.
- [ ] 최소 변경 기준:
  - URL을 단일 진실 원천으로 만들고,
  - Recoil은 “임시 브리지”로만 사용하거나 제거를 목표로 합니다.

## Definition of Done(DoD)
- 검색어/페이지가 URL에 반영되고 새로고침에도 상태가 유지됩니다(원문 DoD).
- 201 응답을 정상 처리하며, 빈 결과/오류가 일관 UX로 표현됩니다.

## 검증 방법
- [ ] Swagger UI에서 `POST /api/v1/festivals`(`title=서울`) 결과와 프론트 결과가 일치하는지 비교합니다(원문 3.3 검증).
- [ ] `?q=...` URL을 직접 입력해도 검색 결과가 재현되는지 확인합니다.

## 주의/함정
- 201 성공 처리를 놓치면 검색이 “항상 실패”처럼 보일 수 있습니다.
