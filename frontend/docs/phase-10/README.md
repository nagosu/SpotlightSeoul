# Phase 10 — 상세 `/festivals/{id}` 정합 + 렌더 가드 + 지도 조건부 렌더

## 목표(Why)
- 상세 API(`GET /api/v1/festivals/{id}`) 계약에 맞게 데이터를 매핑하고, nullable/누락 필드에도 화면이 깨지지 않게 합니다.
- 지도는 “좌표가 있을 때만” 렌더하고, 로딩/실패 시 대체 UI로 안전하게 처리합니다.

## 범위(Scope)
- 대상 파일(원문 기준): `src/pages/DetailPage.tsx`, `src/components/FestivalInformation.tsx`, `src/components/MapInformation.tsx`, `index.html`(지도 로딩 정책은 Phase 16에서 정리)
- API: `GET /api/v1/festivals/{id}` (200, 조회수 +1)

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 3.2(상세)

## 선행조건(Dependencies)
- Phase 3(HTTP), Phase 4(camelCase), Phase 8(Query), Phase 5(상태 UX)

## 작업 체크리스트(아주 상세)
### A. 상세 조회를 Query로 표준화(원문 3.2)
- [ ] queryKey: `['festivals','detail', id]`
- [ ] queryFn은 공통 API 함수(`src/api/festivals.ts`)를 사용합니다.
- [ ] 응답은 camelCase로 들어온다는 전제 하에 UI에서 snake_case를 쓰지 않습니다.

### B. nullable/누락 필드 렌더 가드
- [ ] 이미지 URL이 없을 때 대체 이미지/플레이스홀더를 보여줍니다.
- [ ] 날짜/시간/장소/링크가 없을 때 UI가 깨지지 않도록 조건부 렌더를 적용합니다.
- [ ] 좌표(`lat/lot`)가 없을 때 지도 영역 자체를 숨기고 안내 문구로 대체합니다.

### C. 지도 컴포넌트 조건부 렌더(원문 3.2)
- [ ] “좌표가 있을 때만” 지도 렌더
- [ ] 지도 로딩 중 상태(스피너/문구)
- [ ] 지도 로딩 실패 시 대체 UI(“지도를 불러오지 못했습니다”)

### D. 상세 화면의 상태 UX(Phase 5)
- [ ] 로딩: 스켈레톤/스피너
- [ ] 오류: 재시도 버튼
- [ ] 데이터는 있으나 일부 필드가 비어있음: “빈 값”을 안전하게 표시

## Definition of Done(DoD)
- 상세 진입 시 스펙 필드가 nullable여도 화면이 크래시하지 않습니다(원문 DoD).
- 조회수/좋아요/기간/주소/이미지 등의 주요 필드가 계약대로 매핑됩니다.
- 지도는 좌표가 있을 때만 안전하게 로드되며, 실패해도 상세 화면이 살아있습니다.

## 검증 방법
- [ ] Swagger UI에서 동일 id를 호출한 결과와 프론트 표시가 키 기준으로 일치하는지 확인합니다(원문 3.2 검증).
- [ ] 좌표가 없는 데이터/이미지가 없는 데이터로 상세 진입해도 화면이 깨지지 않는지 확인합니다.

## 주의/함정
- 상세 응답의 snake_case를 UI에서 직접 쓰기 시작하면 이후 유지보수 비용이 크게 증가합니다. 변환은 반드시 공통 레이어에서 1회만 수행해야 합니다.
