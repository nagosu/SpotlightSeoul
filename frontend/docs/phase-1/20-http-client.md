# [P1-HTTP-01] 공통 HTTP 클라이언트 생성

## 작업(What)

- 공통 HTTP 레이어를 도입합니다(axios instance + interceptor 또는 최소 fetch wrapper).
- 공통 옵션을 한 곳으로 모읍니다.
  - baseURL
  - 기본 헤더(`Content-Type` 등)
  - 타임아웃/기본 옵션

## 산출물(Deliverables)

- `apiClient`(axios instance 또는 fetch wrapper)

## 완료 기준(DoD)

- 신규 API 호출은 “직접 axios/fetch”가 아니라 공통 클라이언트를 사용합니다.

## 검증(Verification)

- 목록/상세/검색 중 1~2개 호출부를 공통 클라이언트로 전환해 실제 동작을 확인합니다.

