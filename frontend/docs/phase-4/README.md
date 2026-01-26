# Phase 4 — snake_case → camelCase 변환 유틸(Deep camelCase)

## 목표(Why)
- 서버 응답(snake_case)을 프론트 내부 표준(camelCase)로 **일관되게 변환**하여 UI/상태/컴포넌트가 “한 가지 규칙”만 따르도록 합니다.
- 변환 위치를 공통 레이어로 고정해, 화면마다 변환 로직이 중복되는 것을 방지합니다.

## 범위(Scope)
- “깊은 변환(deep)” 기준을 문서로 고정합니다(배열/중첩 객체 포함).
- 변환 예외(Blob/파일/특수 타입) 정책을 명시합니다.

## 근거(Evidence)
- `frontend/docs/FRONTEND-UPGRADE-PHASES.md` 1.1(데이터 키 정책), 4.3(변환 정책 점검)

## 선행조건(Dependencies)
- Phase 1(규칙), Phase 3(HTTP 레이어 표준)

## 작업 체크리스트(아주 상세)
### A. 변환 책임 위치 확정
- [ ] 변환은 “어딘가에서 한 번만” 수행합니다(권장: axios 응답 인터셉터).
- [ ] 화면/컴포넌트에서는 snake_case 키 접근을 금지합니다.

### B. 변환 대상/범위 정의
- [ ] 변환 대상: JSON 객체/배열(중첩 포함)
- [ ] 변환 제외(예외):
  - Blob/ArrayBuffer/Stream/FormData 등 바이너리/전송 객체
  - Date 같은 런타임 객체(있다면)
- [ ] 변환은 기본적으로 “키(key)”만 변환하고 “값(value)”은 그대로 둡니다.

### C. 변환 규칙(대표 키) 포함
원문 1.1의 대표 변환 예시를 기준으로, README에 “대표 매핑”을 포함합니다.
- [ ] `access_token` → `accessToken`
- [ ] `total_page_num` → `totalPageNum`
- [ ] `post_responses` → `postResponses`
- [ ] `festival_like` → `festivalLike`
- [ ] `festival_view` → `festivalView`
- [ ] `main_img` → `mainImg`, `thumb_img` → `thumbImg`
- [ ] `strt_date` → `strtDate`, `end_date` → `endDate`
- [ ] `org_link` → `orgLink`
- [ ] `is_free` → `isFree`
- [ ] `major_code_name` → `majorCodeName`, `gu_name` → `guName`, `sub_code_name` → `subCodeName`
- [ ] `distance_km` → `distanceKm`

### D. 검증 포인트(원문 4.3 체크리스트 흡수)
- [ ] UI/상태/컴포넌트에서 snake_case 키를 직접 참조하는 코드가 없는지 확인합니다.
- [ ] 배열/중첩 객체에서도 변환이 적용되는지 확인합니다.
- [ ] 파일/바이너리 응답(Blob 등)을 다루게 될 경우 변환 대상에서 제외한다는 확장 포인트를 문서에 남깁니다.

## Definition of Done(DoD)
- 프론트 내부에서는 camelCase만 사용한다는 전제가 유지됩니다.
- 변환 규칙/예외/검증 포인트가 문서로 고정되어, 누구나 같은 방식으로 구현할 수 있습니다.

## 검증 방법
- [ ] 변환 유틸 구현 후(Phase 3 적용 포함), Swagger 응답의 snake_case가 UI에서 camelCase로만 사용되는지 샘플 화면(목록/상세/검색)에서 확인합니다.
- [ ] 레포에서 snake_case 키(예: `festival_like`, `post_responses`)를 검색했을 때, “변환 유틸/타입 정의” 외에 UI 코드에 남아있지 않은지 확인합니다.

## 주의/함정
- 변환을 화면에서 “그때그때” 하면 중복/불일치가 생기고, 타입도 깨지기 쉽습니다. 반드시 공통 레이어에 고정하는 것이 핵심입니다.
