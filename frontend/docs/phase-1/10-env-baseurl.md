# [P1-ENV-01] 환경 변수 기반 baseURL 도입

## 작업(What)

- `VITE_API_BASE_URL`를 도입해 API baseURL을 환경 변수로 관리합니다.
- 로컬/운영/스테이징 전환 규칙을 문서로 남깁니다.

## 산출물(Deliverables)

- 환경 변수 키/예시 값(예: `.env.example`)
- 실행 방법 문서(이 파일 또는 README/상위 문서)

## 완료 기준(DoD)

- API baseURL 전환이 코드 수정 없이 환경 변수로만 가능합니다.

## 검증(Verification)

- `VITE_API_BASE_URL=https://api.spotlight-seoul.shop`로 실행해 주요 API 호출이 정상인지 확인합니다.

