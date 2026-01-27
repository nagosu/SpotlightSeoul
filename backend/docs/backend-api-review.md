# Backend API 리뷰 (NestJS) — 실서비스 기준

- **작성일**: 2026-01-27
- **리뷰 범위**: `backend/src` (부트스트랩/전역 설정, 모듈/컨트롤러/DTO, 공통 필터·인터셉터·미들웨어, 주요 서비스/리포지토리)

## TL;DR (클라이언트 스펙 관점 Top 이슈)

- **에러 응답 포맷이 지나치게 단순**해서(현재 `{ message }`만) 클라이언트가 **필드 검증 오류/원인 분기/추적(request-id)** 를 하기 어렵습니다. → 표준 에러 포맷(코드/필드별 errors/requestId) 제안
- **pagination 파라미터 네이밍과 기본값이 혼재**합니다. (`offset`=페이지번호 vs `page`, `size` 기본값 10/20 혼재) → 규칙 통일/Deprecated 안내 제안
- **상태코드/도메인 의미가 어긋난 곳**이 있습니다. (예: 로그인/검색이 201, 검색결과 없음이 400) → 최소 변경으로 200/404/빈 리스트 등 정리 제안

---

## 1) 라우팅/모듈 구조가 NestJS 권장 패턴을 따르는지

### 현재 상태
- 전역 prefix를 `api/v1`로 설정하고(`backend/src/main.ts:L11-L24`), 모듈 단위로 `FestivalModule`, `UserModule`, `AdminModule` 등을 `AppModule`에서 import합니다(`backend/src/app.module.ts:L15-L31`).
- `FestivalController`는 `@Controller('festivals')`로 베이스 경로를 잡는 반면(`backend/src/modules/festival/festival.controller.ts:L45-L46`), `UserController`는 `@Controller()`(빈 prefix) + 메서드에 `'users'`, `'login'` 등을 직접 기입합니다(`backend/src/modules/user/user.controller.ts:L28-L30`, `L50-L71`).

### 문제점(클라이언트/운영 관점)
- 컨트롤러마다 라우팅 스타일이 섞이면(Controller prefix vs 메서드에 풀 경로) **API 그룹 구조가 한눈에 안 들어오고**, 신규 엔드포인트 추가 시 실수(중복/누락) 가능성이 커집니다.

### 최소 변경 개선안
- **기존 URL은 유지**하되, 다음부터 추가되는 기능은 컨트롤러 prefix 방식으로 통일하는 것을 권장합니다.
  - 예: `UserController`를 `@Controller('users')`로 두고 `@Post()`/`@Get(':userId')` 스타일로 정리(기존 경로 유지가 필요하면 현재는 문서에 “라우팅 컨벤션”만 확정해도 효과가 큼)

### 근거 코드
- 전역 prefix/Swagger 경로: `backend/src/main.ts:L11-L24`
- 모듈 구성: `backend/src/app.module.ts:L15-L39`
- 컨트롤러 라우팅 스타일 혼재: `backend/src/modules/user/user.controller.ts:L28-L30`, `backend/src/modules/festival/festival.controller.ts:L45-L46`

---

## 2) DTO/Validation(ValidationPipe) 적용 여부, 요청/응답 스키마 일관성

### 현재 상태
- 전역 `ValidationPipe`가 적용되어 있고 변환(`transform`) 및 암묵적 타입 변환(`enableImplicitConversion`)이 켜져 있습니다(`backend/src/main.ts:L34-L40`).
- 요청 DTO는 `class-validator`를 사용합니다(예: `UserCreateRequest`/`UserLoginRequest` 등 `@IsEmail`, `@IsNotEmpty`) (`backend/src/modules/user/dto/request/user-create.request.ts:L4-L23`, `user-login.request.ts:L4-L13`).
- Query DTO도 `class-validator`가 적용되어 있습니다(예: `FestivalListQuery`의 `@IsInt`, `@Min`) (`backend/src/modules/festival/dto/response/festival-list-query.ts:L31-L42`).

### 문제점(클라이언트/운영 관점)
- **화이트리스트/금지 옵션이 꺼져 있어**(현재 `whitelist`, `forbidNonWhitelisted` 없음) 클라이언트가 실수로 보내는 **불필요한 필드가 그대로 통과**할 수 있습니다. 이는 보안/스펙 안정성 관점에서 리스크입니다. (근거: `ValidationPipe` 옵션이 transform 관련만 존재 — `backend/src/main.ts:L34-L40`)
- 일부 Query 필드가 “의도와 타입”이 맞지 않거나 검증이 약합니다.
  - `FestivalFilterQuery.isFree?: boolean`은 `@IsBoolean()` 등이 없고(`backend/src/modules/festival/dto/response/festival-filter-query.ts:L15-L22`), 클라이언트가 `'무료'` 같은 문자열을 보낼 때 어떻게 처리되는지 불명확합니다.
  - 날짜 필드 `strtDate/endDate`는 `"YYYY-MM-DD"` 문자열을 기대한다고 설명하지만 실제 검증은 `@IsString()`뿐입니다(`festival-filter-query.ts:L47-L56`).

### 최소 변경 개선안
- 전역 `ValidationPipe`에 다음을 추가하는 것을 권장합니다(기존 DTO를 최대한 유지):
  - `whitelist: true` (+ 필요 시 `forbidNonWhitelisted: true`)
  - 에러 응답 표준화와 함께 `exceptionFactory`로 **필드별 errors 배열**을 유지(3번 섹션 참고)
- 날짜 문자열은 최소한 `@Matches(/^\d{4}-\d{2}-\d{2}$/)` 같은 형태로 포맷을 검증하는 것을 권장합니다(스펙 문서에도 명시).
- `isFree`는 현재 응답에서 문자열(`'무료'`)로 내려가고 있습니다(`backend/src/modules/festival/dto/response/festival-response.ts:L68-L76`). **요청 필터도 boolean이 아니라 문자열/enum로 맞추거나**, boolean이면 서버에서 명시적 매핑을 정의하는 게 클라이언트 혼선을 줄입니다.

### 근거 코드
- 전역 ValidationPipe 옵션: `backend/src/main.ts:L34-L40`
- 요청 DTO 검증: `backend/src/modules/user/dto/request/user-create.request.ts:L4-L23`
- Query DTO 검증/기본값: `backend/src/modules/festival/dto/response/festival-filter-query.ts:L47-L69`, `festival-list-query.ts:L31-L42`
- `is_free`의 실제 의미(문자열): `backend/src/modules/festival/dto/response/festival-response.ts:L68-L76`, `backend/src/modules/festival/entity/festival.entity.ts:L67-L69`

---

## 3) 예외 처리(전역 ExceptionFilter/HttpException), 에러 응답 포맷 표준화

### 현재 상태
- 전역 ExceptionFilter가 등록되어 있고(`backend/src/main.ts:L42-L44`), 필터는 모든 예외를 `{ message }` 형태로 반환합니다(`backend/src/common/filters/http-exception.filter.ts:L33-L49`).
- Validation 에러의 경우 `message` 배열을 문자열로 join하여 반환합니다(`http-exception.filter.ts:L18-L20`, `L46-L48`).
- 모든 응답 키는 snake_case로 변환됩니다(전역 인터셉터) (`backend/src/main.ts:L45-L46`, `backend/src/common/interceptors/snake-case.interceptor.ts:L41-L45`).

### 문제점(클라이언트/운영 관점)
- `{ message }`만 내려가면 클라이언트가 다음을 하기 어렵습니다.
  - **에러 코드 기반 분기**(예: `USER_NOT_FOUND`, `VALIDATION_ERROR`)
  - **필드 단위 검증 오류 표시**(어떤 필드가 왜 틀렸는지) — 현재 join으로 정보가 손실됨
  - **추적/상관관계 분석**: request-id는 헤더로만 내려가고(`backend/src/global/middleware/request-id.middleware.ts:L7-L13`), 에러 바디에는 포함되지 않습니다.

### 최소 변경 개선안(표준 포맷 제안)
- “응답을 전부 감싸는 envelope”까지 한 번에 바꾸지 않더라도, **에러만이라도 표준화**하는 것이 비용 대비 효과가 큽니다.
- 권장 에러 포맷(예시):

```1:14:backend/src/common/filters/http-exception.filter.ts
// 현재는 { message }만 반환합니다.
// (개선안 예시) 아래 형태로 확장 권장:
// {
//   "request_id": "uuid",
//   "code": "VALIDATION_ERROR",
//   "message": "요청 값이 올바르지 않습니다.",
//   "errors": [{ "field": "email", "reason": "must be an email" }]
// }
```

- `ValidationPipe`의 `exceptionFactory`와 함께, `HttpExceptionFilter`에서 다음을 포함하도록 제안합니다:
  - `statusCode`, `code`, `message`, `errors[]`, `requestId`

### 근거 코드
- 전역 필터 적용: `backend/src/main.ts:L42-L44`
- 현재 에러 포맷: `backend/src/common/filters/http-exception.filter.ts:L10-L30`, `L39-L49`
- request-id 부여: `backend/src/global/middleware/request-id.middleware.ts:L7-L13`

---

## 4) 상태코드 사용 적절성

### 현재 상태/이슈
- **로그인**이 `POST /api/v1/login`인데 `@ApiCreatedResponse`이고(기본 201), 실제로도 201로 응답될 가능성이 높습니다(`backend/src/modules/user/user.controller.ts:L55-L74`).
- **검색**이 `POST /api/v1/festivals`이고 `@ApiCreatedResponse`입니다(`backend/src/modules/festival/festival.controller.ts:L181-L204`).
- **검색 결과 없음**을 `400 BadRequest`로 처리합니다(`backend/src/modules/festival/repository/festival.repository.ts:L72-L74`).

### 왜 문제인지(클라이언트 관점)
- 로그인/검색은 “리소스 생성”이 아니라 “세션/토큰 발급” 혹은 “조회” 성격이라 보통 **200 OK**가 기대됩니다.
- “검색 결과 없음”은 입력값이 잘못된 것이 아니라 결과가 0건인 경우가 많으므로, 400은 클라이언트에서 **오류로 오해**하고 UX가 악화됩니다.

### 최소 변경 개선안
- 로그인: `200 OK`로 정리(문서와 코드 모두).
  - Swagger: `@ApiOkResponse`로 변경(코드 변경은 별도 작업이지만, 이번 요청은 문서-only이므로 문서에 우선 반영 권장)
- 검색:
  - 가장 단순: 결과 0건이면 `200 OK` + `post_responses: []`, `total_page_num: 0` 형태로 반환(가장 클라이언트 친화적)
  - 대안: 정말 “검색어가 비정상”인 경우에만 422/400, “결과 없음”은 200(빈 배열)

### 근거 코드
- 로그인 201: `backend/src/modules/user/user.controller.ts:L55-L74`
- 검색 201: `backend/src/modules/festival/festival.controller.ts:L181-L204`
- 검색 결과 없음이 400: `backend/src/modules/festival/repository/festival.repository.ts:L72-L74`

---

## 5) API 응답 포맷 통일(성공/에러 공통 형태, 에러코드, 필드 검증 오류 표현)

### 현재 상태
- 성공 응답이 엔드포인트별로 “그냥 DTO” 또는 `{ status: 'ok' }` 등으로 섞여 있습니다.
  - 예: `GET /health`는 `{ status: 'ok' }` (`backend/src/health/health.controller.ts:L12-L15`)
  - 예: `GET /admin/open-data/status`는 `{ status: 'ok', lastRunAt, ... }` (`backend/src/modules/admin/open-data-status.controller.ts:L23-L31`)
  - 예: 토글은 `{ festival_like, liked }` 등 (`backend/src/modules/festival/dto/response/festival-like-toggle.response.ts:L3-L9`)
- 에러는 `{ message }` 단일 형태(`backend/src/common/filters/http-exception.filter.ts:L46-L49`).

### 문제점
- 클라이언트 입장에서는 “성공 envelope”가 없어도 작업 가능하지만, 에러는 표준화가 되지 않으면 **분기/UX/로깅** 비용이 급증합니다.
- `snake_case` 전역 변환을 쓰고 있으므로, 클라이언트는 기본적으로 snake_case를 기대하게 됩니다. 이때 Swagger 스키마가 실제와 다르면 혼선이 생깁니다. **Swagger에서 `name: 'created_at'`이 실제 스키마 속성명까지 바꾸는지**는 실행 결과로 확인이 필요합니다.
  - 확인 방법: 서버 실행 후 OpenAPI JSON에서 schema property 키 확인 (`/api/v1/docs-json` 또는 Swagger UI “Schemas”)

### 최소 변경 개선안
- **에러 응답만** 우선 표준화(3번 섹션 포맷), 성공 응답은 점진적 정리.
- 성공 응답을 통일한다면 “최소 변경” 기준으로는 아래 중 하나를 추천합니다.
  - A안: 기존 그대로(다만 문서에 성공 응답 형태를 명확히 기재)
  - B안: 새 엔드포인트부터 `{ data, meta }` envelope로 도입(기존은 유지/Deprecated)

### 근거 코드
- snake_case 전역 적용: `backend/src/main.ts:L45-L46`, `backend/src/common/interceptors/snake-case.interceptor.ts:L16-L45`
- 성공 응답 혼재: `backend/src/health/health.controller.ts:L12-L35`, `backend/src/modules/admin/open-data-status.controller.ts:L23-L31`
- 에러 `{ message }`: `backend/src/common/filters/http-exception.filter.ts:L46-L49`

---

## 6) pagination/sort/filter 규칙 일관성

### 현재 상태(혼재 사례)
- `GET /festivals/page`는 `offset`을 “페이지 번호”로 사용합니다(`backend/src/modules/festival/festival.controller.ts:L102-L113`, `backend/src/modules/festival/repository/festival.repository.ts:L44-L48`).
- 다른 엔드포인트들은 `page`, `size`를 사용합니다.
  - 예: `GET /festivals`는 `FestivalListQuery.page/size` (`backend/src/modules/festival/festival.controller.ts:L95-L100`, `festival-list-query.ts:L31-L42`)
  - 예: `GET /festivals/likes`, `GET /festivals/views`는 `page/size` (`festival.controller.ts:L123-L141`, `L143-L161`)
- `size` 기본값이 엔드포인트에 따라 10/20으로 섞여 있습니다.
  - `/festivals/page`는 size 기본 10(`festival.controller.ts:L109-L113`)
  - 다수는 size 기본 20(`festival-list-query.ts:L38-L42`, `festival.controller.ts:L132-L134` 등)
- `limit`는 suggest에서만 max 20을 둡니다(`backend/src/modules/festival/dto/response/festival-suggest-query.ts:L9-L15`).

### 왜 문제인지(클라이언트 관점)
- 같은 도메인의 리스트 API에서 파라미터 네이밍/기본값이 다르면, 프론트/모바일에서 공통 pagination 유틸을 만들기 어렵고 **버그가 늘어납니다**.

### 최소 변경 개선안
- 규칙을 1개로 확정: `page`(0부터), `size`(기본 20, max 100 등).
- 기존 `offset` 기반 엔드포인트는 유지하되 문서에 **Deprecated**로 표기하고, 동일 기능을 `page/size` 기반으로 유도.
- `size`에 `@Max(n)`을 추가해 “무한대 size” 요청 방지(실서비스 안정성).

### 근거 코드
- offset=페이지번호: `backend/src/modules/festival/festival.controller.ts:L102-L113`
- page/size 혼재: `backend/src/modules/festival/dto/response/festival-filter-query.ts:L58-L69`, `festival-list-query.ts:L31-L42`
- suggest limit 상한: `backend/src/modules/festival/dto/response/festival-suggest-query.ts:L9-L15`

---

## 7) Swagger 문서 품질(Decorator/DTO 반영, 예시, 공통 응답/에러 문서화)

### 현재 상태
- 주요 엔드포인트에 `@ApiOperation`, `@ApiOkResponse/@ApiCreatedResponse`, `@ApiBody(examples)`가 일부 잘 들어가 있습니다.
  - 예: 회원가입/로그인 `@ApiBody` 예시(`backend/src/modules/user/user.controller.ts:L34-L74`)
  - 예: 축제 검색 `@ApiBody` 예시(`backend/src/modules/festival/festival.controller.ts:L181-L204`)
- 반면, **에러 응답 문서화**가 거의 없습니다(예: 400/401/404/409 등).
  - `Admin`만 `@ApiNotFoundResponse`를 명시(`backend/src/modules/admin/open-data-status.controller.ts:L18-L22`)

### 문제점
- 클라이언트 개발자는 Swagger를 보고 “어떤 경우에 어떤 에러가 오는지”를 가장 먼저 봅니다. 현재는 이를 추론해야 해서 실수하기 쉽습니다.

### 최소 변경 개선안
- 공통 에러 응답 DTO(예: `ErrorResponse`, `ValidationErrorResponse`)를 정의하고, 자주 나오는 에러(400/401/404)만이라도 컨트롤러에 명시:
  - `@ApiBadRequestResponse`, `@ApiUnauthorizedResponse`, `@ApiNotFoundResponse`
- 전역 prefix가 Swagger에 반영되는지(현재 `useGlobalPrefix: true`)는 좋습니다(`backend/src/main.ts:L21-L24`).

### 근거 코드
- Swagger 설정/전역 prefix 반영: `backend/src/main.ts:L14-L24`
- 예시 작성: `backend/src/modules/user/user.controller.ts:L34-L74`, `backend/src/modules/festival/festival.controller.ts:L181-L204`
- 에러 응답 명시 부족(예외적으로 Admin만): `backend/src/modules/admin/open-data-status.controller.ts:L18-L22`

---

## 8) 버저닝, global prefix, 공통 헤더(request-id) 필요 여부

### 현재 상태
- `api/v1` global prefix를 사용합니다(`backend/src/main.ts:L11-L12`).
- 모든 요청에 `X-Request-Id`를 부여/반환합니다(`backend/src/app.module.ts:L35-L38`, `backend/src/global/middleware/request-id.middleware.ts:L7-L13`).

### 평가/개선 제안(최소 변경)
- global prefix로 버저닝 하는 선택은 실무에서 흔하고 충분합니다.
- `X-Request-Id`는 이미 구현되어 있으니, 다음만 추가하면 “실서비스 디버깅력”이 크게 올라갑니다.
  - 에러 응답 바디에 `request_id` 포함(3번 섹션)
  - Swagger에 공통 헤더로 문서화(요청/응답 헤더)

### 근거 코드
- prefix: `backend/src/main.ts:L11-L12`
- request-id 미들웨어 적용: `backend/src/app.module.ts:L35-L38`, `backend/src/global/middleware/request-id.middleware.ts:L7-L13`

---

## 9) 클라이언트가 실수하기 쉬운 포인트(필드명, null 처리, 날짜 포맷 등)

### (1) 위경도 필드명: `lat` + `lot`
- 일반적으로 경도는 `lng`/`lon`이 많아, `lot`는 클라이언트에서 오타로 오해하기 쉽습니다.
  - 근거: 엔티티/DTO가 모두 `lot` 사용 (`backend/src/modules/festival/entity/festival.entity.ts:L32-L36`, `backend/src/modules/festival/dto/response/festival-response.ts:L55-L58`, `festival-near-query.ts:L10-L13`)
- 최소 변경 개선: 문서에 “`lot`=longitude”를 강하게 명시하고, 차후 `lng` alias 지원 여부를 검토(기존 유지).

### (2) 날짜/시간과 타임존 혼선
- 필터 입력은 `"YYYY-MM-DD"`이고 서버에서 `+09:00`로 경계 처리합니다(`backend/src/modules/festival/repository/festival.repository.ts:L98-L105`).
- 응답은 `Date`가 JSON 직렬화되면 보통 UTC ISO 문자열(`...Z`)이 됩니다(예시도 Z로 표기) (`backend/src/modules/festival/dto/response/festival-response.ts:L38-L53`).
- 최소 변경 개선: 문서에 **입력은 KST 기준 날짜, 응답은 ISO(UTC) 문자열**임을 명확히 적고, 필요하면 응답을 KST 문자열로 통일(단, 이는 클라이언트/서버 합의 필요).

### (3) “지원하지 않는 필터를 받는” 스펙
- `FestivalFilterQuery`는 DB에 없는 필드(`isFree`, `majorCodeName`, `guName`, `subCodeName`)를 “입력은 받되 미적용”으로 주석 처리해두었습니다(`backend/src/modules/festival/dto/response/festival-filter-query.ts:L15-L45`, `backend/src/modules/festival/repository/festival.repository.ts:L95-L97`).
- 클라이언트는 이 필터가 동작한다고 믿고 기능을 만들기 쉬워서, 출시 후 “왜 안 되지?” 문제가 생깁니다.
- 최소 변경 개선: Swagger description에 “현재 미적용”을 유지하되, **엔드포인트 설명에도 명시**하고, 가능하면 `deprecated: true` 또는 별도 “미지원” 목록을 문서 상단에 표기.

### (4) 인증/권한 관련(실서비스 리스크)
- `PUT /users`(회원수정), `DELETE /users/:id`(삭제)는 인증 가드가 없습니다(`backend/src/modules/user/user.controller.ts:L86-L116`).
- 비밀번호는 현재 평문 저장/비교를 전제로 되어 있습니다(`backend/src/modules/user/user.service.ts:L18-L23`, `L65-L72`, `backend/src/modules/user/entity/user.entity.ts:L16-L18`, `backend/src/modules/user/repository/user.repository.ts:L41-L49`).
- 이번 요청은 문서-only이므로, 최소 변경 제안으로는:
  - “운영 배포 전 반드시” 체크리스트로 상단에 고지(보안/계정 보호)

---

## 부록 A) 권장 에러 응답 스펙(제안)

- **HTTP**: 적절한 상태코드 + JSON 바디
- **Body**(snake_case):
  - `request_id`: string
  - `code`: string (예: `VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`)
  - `message`: string (사용자 노출 가능 문구)
  - `errors`: optional array (필드 검증 시)
    - `{ field: string, reason: string }`

---

## 부록 B) 권장 pagination/sort/filter 규칙(제안)

- **Pagination**: `page`(0부터), `size`(기본 20, max 100)
- **Sort**: `sort`(필드), `order`(`asc|desc`)
- **Filter**: 도메인 필터는 snake_case로 통일(예: `strt_date` 대신 요청은 `start_date` 같은 명확한 이름도 고려 — 단, 기존 유지가 필요하면 문서로 명확히)

---

## 부록 C) Swagger 개선 체크리스트(최소 변경)

- 각 엔드포인트에 최소한 다음 에러를 명시:
  - 400(Validation), 401(Unauthorized), 404(Not found)
- 공통 헤더(`X-Request-Id`) 문서화
- “미지원 필터/Deprecated 엔드포인트” 문서 상단에 정리

