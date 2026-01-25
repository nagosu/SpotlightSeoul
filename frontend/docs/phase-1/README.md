# Phase 1 작업 보드(태스크 단위)

> 상위 문서: `frontend/docs/FRONTEND-UPGRADE-PHASES.md`  
> 이 폴더는 Phase 1을 **태스크 단위로 쪼개서** “하나씩 완료”할 수 있게 만든 작업 보드입니다.

## 권장 진행 순서

### 0. Phase 1에서 확정해야 할 정책(먼저 결정)
- `00-decisions.md`

### 1. 환경 변수 / baseURL
- `10-env-baseurl.md`
- `11-remove-hardcoded-localhost.md`

### 2. 공통 HTTP 레이어
- `20-http-client.md`
- `21-auth-header.md`
- `22-error-normalization.md`
- `23-401-entrypoint.md`

### 3. 타입(최소) 고정
- `30-types-core-responses.md`
- `31-snakecase-mapping-policy.md`

### 4. 개발 재현성 / DX 기준선
- `40-lockfile-package-manager.md`
- `41-eslint-ts-baseline.md`
- `42-quality-gates.md`

## Phase 1 최종 완료 체크
- `90-phase1-dod.md`

