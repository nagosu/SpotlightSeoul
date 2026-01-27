# Backend API 변경 로그 (Changelog)

- **작성일**: 2026-01-27
- **버전**: 1.1.0 (리뷰 기반 개선)

이 문서는 `backend-api-review.md` 기반으로 적용된 API 변경 사항과 클라이언트 마이그레이션 가이드를 정리합니다.

---

## 주요 변경 요약

### 비호환(Breaking) 변경

- 에러 응답 포맷이 `{ message }` → `{ request_id, status_code, code, message, errors? }`로 확장됨
- 로그인(`POST /login`) 응답 코드: `201` → `200`
- 검색(`POST /festivals`) 응답 코드: `201` → `200`
- 검색 결과 0건: `400 BadRequest` → `200 OK` + 빈 배열
- `/festivals/page` 기본 size: `10` → `20`

### 개선(호환) 변경

- `ValidationPipe`에 `whitelist: true` 추가 (DTO에 없는 필드 자동 제거)
- pagination `size` 상한 `@Max(100)` 적용
- Swagger 문서에 공통 에러 응답/X-Request-Id 헤더 명시
- `/festivals/page` 엔드포인트 Deprecated 표기 (GET /festivals 권장)

---

## 상세 변경 내역

### 1. 에러 응답 포맷 표준화

**Before**

```json
{ "message": "요청 값이 올바르지 않습니다." }
```

**After**

```json
{
  "request_id": "uuid-string",
  "status_code": 400,
  "code": "VALIDATION_ERROR",
  "message": "요청 값이 올바르지 않습니다.",
  "errors": [
    { "field": "email", "reason": "must be an email" }
  ]
}
```

**마이그레이션 가이드**:
- 에러 응답 파싱 시 `code` 필드로 분기 처리 가능
- Validation 에러의 경우 `errors` 배열에서 필드별 오류 확인
- `request_id`는 CS/디버깅 시 로그 추적에 활용

**변경 파일**:
- `backend/src/common/filters/http-exception.filter.ts`
- `backend/src/common/dto/error-response.ts` (신규)
- `backend/src/main.ts` (ValidationPipe exceptionFactory 추가)

---

### 2. 상태코드 정리

| 엔드포인트 | 변경 전 | 변경 후 | 비고 |
|------------|---------|---------|------|
| `POST /login` | 201 | 200 | 토큰 발급은 리소스 생성이 아님 |
| `POST /festivals` | 201 | 200 | 검색은 조회 성격 |
| `POST /festivals` (0건) | 400 | 200 + 빈 배열 | 클라이언트 친화적 |

**마이그레이션 가이드**:
- 로그인/검색 성공 시 `201`이 아닌 `200`을 기대하도록 수정
- 검색 결과 0건일 때 에러 처리 로직 제거 → 빈 배열 체크로 변경

**변경 파일**:
- `backend/src/modules/user/user.controller.ts`
- `backend/src/modules/festival/festival.controller.ts`
- `backend/src/modules/festival/repository/festival.repository.ts`

---

### 3. Pagination 규칙 통일

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 기본 page | 0 | 0 (동일) |
| 기본 size | 10 또는 20 (혼재) | 20 (통일) |
| size 상한 | 없음 | 100 |
| `/festivals/page` | 정상 | Deprecated (GET /festivals 권장) |

**마이그레이션 가이드**:
- `/festivals/page`를 사용 중이라면 `GET /festivals?page=0&size=20` 으로 전환 권장
- size 100 초과 요청 시 Validation 에러 발생 (DTO 검증)
- `/festivals/page`는 서버 단에서 size를 100으로 clamp

**변경 파일**:
- `backend/src/modules/festival/dto/response/festival-filter-query.ts`
- `backend/src/modules/festival/dto/response/festival-list-query.ts`
- `backend/src/modules/festival/dto/response/festival-near-query.ts`
- `backend/src/modules/festival/festival.controller.ts`

---

### 4. Swagger 문서 개선

- API 설명에 **에러 응답 포맷**과 **X-Request-Id 헤더** 설명 추가
- 각 엔드포인트에 공통 에러 응답(400/401/404/500) 명시
- Deprecated 엔드포인트(`/festivals/page`) 표기

**변경 파일**:
- `backend/src/main.ts` (Swagger DocumentBuilder 설정)
- `backend/src/common/decorators/api-common-responses.decorator.ts` (신규)
- `backend/src/modules/user/user.controller.ts`
- `backend/src/modules/festival/festival.controller.ts`

---

### 5. ValidationPipe 강화

- `whitelist: true` 적용: DTO에 정의되지 않은 필드는 자동 제거됨
- (선택적) `forbidNonWhitelisted: true` 활성화 시, 불필요 필드 전송 시 400 에러

**마이그레이션 가이드**:
- 기존에 DTO에 없는 필드를 함께 보내던 경우, 해당 필드는 서버에서 무시됨
- 문제없이 동작하려면 DTO 스펙에 맞는 필드만 전송

---

## 신규 파일 목록

| 파일 | 설명 |
|------|------|
| `backend/src/common/dto/error-response.ts` | 표준 에러 응답 DTO (`ErrorResponse`, `FieldError`) |
| `backend/src/common/decorators/api-common-responses.decorator.ts` | Swagger 공통 에러 응답 데코레이터 |
| `backend/docs/backend-api-changelog.md` | 이 문서 |

---

## 검증 체크리스트

서버 실행 후 다음을 확인하세요:

- [ ] `POST /api/v1/login` → 200 OK + `{ access_token }`
- [ ] `POST /api/v1/festivals` (0건 검색) → 200 OK + `{ total_page_num: 0, post_responses: [] }`
- [ ] Validation 실패 시 → `{ request_id, status_code, code, message, errors[] }` 형태
- [ ] size > 100 요청 시 → 400 VALIDATION_ERROR
- [ ] Swagger UI (`/api/v1/docs`)에서 에러 응답/X-Request-Id 헤더 문서 확인

---

## 참고

- 리뷰 문서: [`backend/docs/backend-api-review.md`](backend-api-review.md)
