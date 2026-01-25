# [P1-ENV-02] `http://localhost:8080` 하드코딩 제거(전수)

## 작업(What)

- 프론트 코드에서 `http://localhost:8080` 하드코딩 호출을 전수 제거합니다.
- 모든 API 호출이 공통 HTTP 레이어의 baseURL을 사용하게 만듭니다.

## 산출물(Deliverables)

- 하드코딩 호출부가 공통 클라이언트로 전환된 코드

## 완료 기준(DoD)

- 문자열 `http://localhost:8080`이 프론트 코드에서 0건입니다.

## 검증(Verification)

- IDE 전체 검색 또는 `rg "http://localhost:8080"`로 0건인지 확인합니다.

