# Phase 12 — 좋아요(레거시 +1 → Bearer 토글) 마이그레이션

## 목표(Why)
- 현재 레거시 “좋아요 +1” 구현을 최종 계약인 **Bearer 토글 API**로 일원화합니다.
- 비로그인 UX(로그인 유도), 로그인 후 UX(optimistic update/롤백)를 표준화합니다.

## 범위(Scope)
- 최종(권장): `PUT /api/v1/festivals/{id}/like` (Bearer, 200) → `{ festival_like, liked }`
- 레거시(과도기): `PUT /api/v1/festivals/likes/{id}` (200) → `{ festival_like }`
- 대상 파일(원문 기준): `src/components/FestivalInformation.tsx`, `src/pages/DetailPage.tsx`

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 3.5(좋아요), 7(리스크: 레거시/토글 공존)

## 선행조건(Dependencies)
- Phase 6(로그인), Phase 7(401/복귀), Phase 8(Query), Phase 10(상세 정합)

## 작업 체크리스트(아주 상세)
### A. 과도기 전략 결정(원문 3.5)
- [ ] 로그인 기능이 붙기 전까지는 레거시 +1을 유지할지 여부를 결정합니다.
  - 옵션 A: 초기부터 토글만 지원(비로그인은 로그인 유도)
  - 옵션 B: 과도기 동안은 +1 유지, 로그인 기능 완료 후 토글로 전환(원문에 가까움)
- [ ] 선택한 전략을 문서에 명시합니다(혼선 방지).

### B. 비로그인 UX(필수)
- [ ] 비로그인 상태에서 좋아요 클릭 시:
  - 로그인 유도(Phase 7 정책)
  - 로그인 후 상세로 복귀(returnTo)

### C. 토글 구현(로그인 이후)
- [ ] `useMutation`으로 토글 API를 호출합니다.
- [ ] 성공 시 캐시 동기화(Phase 8 정책)
  - 상세 캐시(`['festivals','detail', id]`)의 `festivalLike/liked`를 갱신
  - 목록 캐시는 UX 필요 시에만 갱신 또는 invalidate
- [ ] 실패 시 UX
  - optimistic update를 쓴다면 롤백
  - 네트워크 오류 메시지 표시(Phase 5)

### D. 레거시 제거 완료 조건
- [ ] 최종적으로 레거시 `PUT /festivals/likes/{id}` 호출이 코드에서 제거됩니다.
- [ ] 좋아요 수/상태는 토글 응답의 `festivalLike/liked`로만 표현됩니다.

## Definition of Done(DoD)
- 좋아요는 토글 API로만 동작하고, 응답의 `festivalLike/liked`가 UI에 반영됩니다(원문 DoD).
- 토큰 없음/있음 케이스가 모두 깨지지 않습니다.

## 검증 방법
- [ ] 토큰 없음: 좋아요 클릭 → 로그인 유도 → 로그인 후 복귀
- [ ] 토큰 있음: 좋아요 토글 시 UI가 즉시 일관되게 갱신(상세/목록 모순 없음)

## 주의/함정
- 레거시와 토글이 공존하는 동안, “좋아요 수”만 있고 “liked 상태”가 없는 데이터와 섞일 수 있습니다. UI 표시에 필요한 최소 상태(예: 버튼 활성/비활성)를 문서로 먼저 정해야 합니다.
