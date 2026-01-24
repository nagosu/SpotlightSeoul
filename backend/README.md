# Seoul Festival API (NestJS)

서울 Open API(문화행사) 데이터를 수집/저장하고, 조회/검색/필터/좋아요/조회수 기능을 제공하는 백엔드 API입니다.

> ✅ Base Path: `/api/v1`  
> ✅ 응답 JSON: `snake_case`  
> ✅ Swagger: `/api/v1/docs`
> ✅ 운영(Base URL): `https://api.spotlight-seoul.shop/api/v1`

### 빠른 링크

- **Health**: `https://api.spotlight-seoul.shop/api/v1/health`
- **Readiness(DB 포함)**: `https://api.spotlight-seoul.shop/api/v1/health/ready`
- **Swagger UI**: `https://api.spotlight-seoul.shop/api/v1/docs`

---

## 목차 🧭

- [1. 왜 마이그레이션을 했나요?](#1-왜-마이그레이션을-했나요)
- [2. 이 프로젝트가 하는 일](#2-이-프로젝트가-하는-일)
- [3. 기술 스택](#3-기술-스택)
- [4. 아키텍처 개요](#4-아키텍처-개요)
- [5. 폴더 구조](#5-폴더-구조)
- [6. 환경변수(.env)](#6-환경변수env)
- [7. 로컬 개발 실행](#7-로컬-개발-실행)
- [8. Docker로 실행](#8-docker로-실행)
- [9. EC2 + Nginx 배포(운영)](#9-ec2--nginx-배포운영)
- [10. API 테스트 방법](#10-api-테스트-방법)
- [11. 운영 팁(로그/재배포/장애대응)](#11-운영-팁로그재배포장애대응)

---

## 1. 왜 마이그레이션을 했나요?

이 프로젝트는 과거에 진행했던 **SpotlightSeoul** 프로젝트의 프론트엔드를 고도화하려는 목적에서 시작했습니다.  
하지만 기존 프로젝트의 백엔드는 **기존 Spring(Java) 기반**이었고, 현재 환경에서 그대로 구동/수정하기가 어려웠습니다.  
그래서 제가 더 익숙하고 유지보수가 쉬운 **NestJS로 마이그레이션**하면서, 코드를 더 탄탄하게 정리하고 기능을 보강했습니다.

### 마이그레이션 배경 🎯

- 기존 Spring(Java) 백엔드는 환경/의존성/운영 방식이 달라 **직접 고치고 운영하기에 비용이 컸습니다.**
- NestJS로 옮기면 제가 익숙한 스택에서 **기능 추가/리팩터링/테스트/배포**를 빠르게 추진할 수 있습니다.

### 마이그레이션 목표 ✅

- 기존(Spring) 동작을 “최대한 동일하게” 이식 + 코드 품질/운영 안정성 강화
  - `/api/v1` prefix 유지
  - 응답 `snake_case` 유지
  - Festival/User 도메인 + Open API 수집 로직 유지/정리
- 운영 배포 시 안정성 강화
  - 환경변수 기반 설정(@nestjs/config)
  - Docker 기반 실행
  - EC2 + Nginx 리버스 프록시로 배포(+ HTTPS)

---

## 2. 이 프로젝트가 하는 일

### 핵심 리소스

- **Festival(축제/문화행사)**
  - 서울 Open API(문화행사) 데이터를 수집해 DB에 저장
  - 조회/검색/필터/좋아요/조회수 기능 제공

- **User(사용자)**
  - 회원 CRUD(소프트 삭제)
  - 로그인 시 JWT AccessToken 발급
  - RefreshToken은 DB 저장(재사용 전략)

### 외부 연동

- **서울시 Open API(문화행사 정보)**
  - 데이터셋: `culturalEventInfo` (JSON)
  - API Base URL: `http://openapi.seoul.go.kr:8088`
  - 요청 형식(예시):
    - `http://openapi.seoul.go.kr:8088/{SEOUL_OPEN_API_KEY}/json/culturalEventInfo/1/5`
  - 용도: 행사 목록을 조회 → DB 저장/갱신(부팅 시 1회 동기화 또는 스케줄 기반 동기화)
  - 참고: 서울 열린데이터광장 `https://data.seoul.go.kr/`

---

## 3. 기술 스택 🧰

- **Node.js / NestJS**
- **TypeORM + MySQL**
- **Docker / Docker Compose**
- **Nginx (EC2 Reverse Proxy)**
- **Swagger(OpenAPI)**
- **JWT 인증(Access/Refresh)**

---

## 4. 아키텍처 개요 🏗️

### 요청 흐름

Client → **Cloudflare** → **Nginx(80/443)** → `127.0.0.1:3000` (NestJS 컨테이너) → TypeORM → MySQL

### 전역 정책

- Global Prefix: `/api/v1`
- JSON Response: `snake_case` (Interceptor)
- Validation: `ValidationPipe`
- Exception: Global Filter로 `{ message }` 형태 일관화

---

## 5. 폴더 구조 📁

현재 폴더 구조(요약)입니다.

```
src/
  main.ts
  app.module.ts
  app.controller.ts
  app.service.ts

  health/
    health.module.ts
    health.controller.ts

  config/
    typeorm.config.ts
    typeorm.datasource.ts

  common/
    filters/
      http-exception.filter.ts
    interceptors/
      snake-case.interceptor.ts

  global/
    entity/
      base-time.entity.ts
    middleware/
      request-id.middleware.ts
    utils/
      event-category.util.ts
      time-formatter.ts

  modules/
    admin/
      admin.module.ts
      open-data-status.controller.ts

    festival/
      festival.module.ts
      festival.controller.ts
      festival.service.ts
      festival.mapper.ts
      user-bookmark.controller.ts
      entity/
        festival.entity.ts
        festival-user-like.entity.ts
        festival-user-bookmark.entity.ts
      repository/
        festival.repository.ts
      dto/
        request/
          festival-search.request.ts
        response/
          ...

    seoul-open-data/
      seoul-open-data.module.ts
      seoul-open-data.client.ts
      seoul-open-data.service.ts
      infra/
        postconstruct-festival-data.ts
        scheduler.config.ts
      dto/
        festival-api.request.ts
        festival-api.response.ts

    user/
      user.module.ts
      user.controller.ts
      user.service.ts
      user.mapper.ts
      entity/
        user.entity.ts
      repository/
        user.repository.ts
      jwt/
        jwt-authorization.decorator.ts
        jwt-authorization.guard.ts
        jwt.provider.ts
        user-token-info.type.ts
      dto/
        request/
          user-create.request.ts
          user-login.request.ts
          user-update.request.ts
        response/
          user-login.response.ts
          user.response.ts
```

---

## 6. 환경변수(.env)

> `.env`는 **gitignore** 대상입니다. 서버/로컬에서 직접 생성해주세요.
>
> 이 레포에는 예시 템플릿으로 `env.example`(dotfile이 아닌 형태)가 포함되어 있습니다.
> 로컬/서버에서 `.env`로 복사해 사용하세요.

### .env 예시 ✅

```env
# =========================
# App
# =========================
NODE_ENV=development
TZ=Asia/Seoul

# =========================
# MySQL (docker compose)
# - 컨테이너 생성 시 초기 root 비밀번호/DB 생성에 사용
# =========================
MYSQL_ROOT_PASSWORD=change-me-strong
MYSQL_DATABASE=seoul

# MySQL (Docker/EC2 공통)
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=change-me-strong
DB_SCHEMA=seoul

AUTH_HEADER=Authorization

# JWT
# - 운영에서는 충분히 길고 랜덤한 값 사용 권장 (예: openssl rand -hex 64)
JWT_SECRET=change-me-long-random
JWT_ACCESS_EXPIRES_MINUTES=30
JWT_REFRESH_EXPIRES_DAYS=30

# Seoul Open API
SEOUL_OPEN_API_KEY=YOUR_KEY
SEOUL_OPEN_API_BASE_URL=http://openapi.seoul.go.kr:8088
SEOUL_OPEN_API_DATASET=culturalEventInfo
SEOUL_OPEN_API_CHUNK_SIZE=999

# 운영 안정성(권장)
OPEN_DATA_ENABLED=false
SCHEDULER_ENABLED=false
SEOUL_OPEN_API_TIMEOUT_MS=10000
SEOUL_OPEN_API_MAX_RETRIES=3
```

> ✅ EC2 + Docker Compose에서 `DB_HOST=mysql`로 두면, compose 서비스명으로 MySQL에 붙습니다.
>
> ℹ️ 포트는 현재 코드상 `3000`으로 고정되어 있습니다(운영에서는 Nginx가 80/443만 받고 내부로 프록시).

---

## 7. 로컬 개발 실행 💻

### 1) 패키지 설치

```bash
npm install
```

### 2) `.env` 준비

```bash
cp env.example .env
```

### 3) 로컬 DB 준비

로컬에서 NestJS를 실행하고(MySQL은 Docker로 띄우는 형태) 개발하려면:

1. MySQL만 먼저 띄우고
2. `.env`의 `DB_HOST`를 `127.0.0.1`로 바꿉니다.

```bash
docker compose up -d mysql
```

`.env`에서 최소 변경:

```env
DB_HOST=127.0.0.1
```

### 2) 실행

```bash
npm run start:dev
```

### 3) 확인

- Health: `GET http://localhost:3000/api/v1/health`
- Swagger: `GET http://localhost:3000/api/v1/docs`

---

## 8. Docker로 실행 🐳

### 1) `.env` 준비

```bash
cp env.example .env
# 그리고 .env 값 채우기
```

> Docker로 `backend`까지 같이 실행하는 경우 `.env`의 `DB_HOST=mysql`을 유지하세요.

### 2) 실행

```bash
docker compose up -d --build
docker compose ps
docker compose logs -f backend
```

### 3) 내부 확인

```bash
curl -s http://localhost:3000/api/v1/health
```

---

## 9. EC2 + Nginx 배포(운영) 🌍

> 상세 절차는 제외하고, 운영 환경의 핵심만 요약합니다.

### 운영 구성 요약 ✅

- **도메인**: `https://api.spotlight-seoul.shop`
- **Reverse Proxy**: Nginx(80/443) → `127.0.0.1:3000` (NestJS 컨테이너)
- **DB(MySQL)**: 외부 포트 비노출(컨테이너 네트워크 내부에서만 통신)

### 보안그룹(인바운드) ✅

- 22(SSH): 내 IP만
- 80(HTTP): 0.0.0.0/0
- 443(HTTPS): 0.0.0.0/0
- ❌ 3000/3306 외부 오픈 금지

### 운영 확인(헬스체크)

- `https://api.spotlight-seoul.shop/api/v1/health`
- `https://api.spotlight-seoul.shop/api/v1/health/ready`

### 운영 팁(부하)

Open API 동기화는 비용/부하가 큰 편이라, 운영 기본값은 `OPEN_DATA_ENABLED=false`, `SCHEDULER_ENABLED=false`를 권장합니다.

---

## 10. API 테스트 방법 ✅

### 1) 기본 확인

```bash
curl -s http://localhost:3000/api/v1/health
curl -s http://localhost:3000/api/v1/festivals/page?offset=0&size=10
```

### 2) DB에 테스트 데이터 넣고 확인(MySQL 컨테이너 기준)

> 아래는 로컬/서버 모두에서 사용 가능한 예시입니다.

```bash
docker exec -it seoul-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} -e "
USE ${DB_SCHEMA};
INSERT INTO festival (title, place, festival_view, festival_like, is_end)
VALUES ('서울 테스트 축제', '서울', 0, 0, NULL);
"
```

```bash
curl -s http://localhost:3000/api/v1/festivals/page?offset=0&size=10
curl -s http://localhost:3000/api/v1/festivals/1
curl -s -X PUT http://localhost:3000/api/v1/festivals/likes/1
```

> ✅ Festival 상세 조회는 조회수(`festival_view`)가 증가하는 동작을 포함합니다.

---

## 11. 운영 팁(로그/재배포/장애대응) 🧯

### 로그 보기

```bash
docker compose -f docker-compose.prod.yml logs -f backend
```

### 재배포(업데이트)

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### 1회 동기화(필요할 때만)

운영에서 `OPEN_DATA_ENABLED=false`로 두고, 필요할 때만 1회 동기화를 수행하고 싶다면:

```bash
cd <repo>

# 1) 토글 켜기 (1회 동기화 용도)
sed -i 's/^OPEN_DATA_ENABLED=.*/OPEN_DATA_ENABLED=true/' .env
sed -i 's/^SCHEDULER_ENABLED=.*/SCHEDULER_ENABLED=false/' .env

# 2) 임시로 backend 컨테이너를 포그라운드 1회 실행(끝나면 종료)
docker compose -f docker-compose.prod.yml run --rm backend

# 3) 다시 끄기 + 운영 컨테이너 재기동
sed -i 's/^OPEN_DATA_ENABLED=.*/OPEN_DATA_ENABLED=false/' .env
sed -i 's/^SCHEDULER_ENABLED=.*/SCHEDULER_ENABLED=false/' .env
docker restart seoul-backend
```

### 컨테이너 상태 확인

```bash
docker compose -f docker-compose.prod.yml ps
```
