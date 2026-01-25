# [P1-HTTP-03] 표준 에러 변환(Response/Error Interceptor)

## 작업(What)

- 네트워크/서버/클라이언트 오류를 “표준 에러 형태”로 변환합니다.
  - 네트워크 오류(offline/timeout)
  - 4xx/5xx HTTP 오류(특히 401)

## 산출물(Deliverables)

- 표준 에러 형태(예시 필드)
  - `status`: number | undefined
  - `code`: string | undefined
  - `message`: string
  - `isNetworkError`: boolean

## 완료 기준(DoD)

- 화면 단에서는 `console.log(error)` 의존 대신, 표준화된 에러 정보를 기반으로 로딩/에러 UI를 구성할 수 있습니다.

## 검증(Verification)

- 의도적으로 실패 케이스를 만들어 확인합니다.
  - 잘못된 baseURL(네트워크 오류)
  - 보호 API를 토큰 없이 호출(401)
  - 존재하지 않는 리소스 호출(404)

