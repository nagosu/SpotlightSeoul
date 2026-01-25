# [P1-HTTP-02] 인증 헤더 주입(Request Interceptor)

## 작업(What)

- 토큰이 있을 때만 요청 헤더에 `Authorization: Bearer <token>`을 자동 주입합니다.
- 토큰이 없으면 헤더를 추가하지 않습니다(불필요한 인증 헤더 전파 방지).

## 산출물(Deliverables)

- 공통 HTTP 레이어의 request interceptor(또는 wrapper 내부 로직)

## 완료 기준(DoD)

- Bearer 인증이 필요한 API 호출이 공통 레이어를 통해 자동으로 헤더를 갖습니다.

## 검증(Verification)

- DevTools Network에서 토큰 있음/없음 각각의 요청 헤더를 확인합니다.

