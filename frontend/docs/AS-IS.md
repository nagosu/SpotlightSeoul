# AS-IS Snapshot (2026-01-19)

> 절대 원칙: 아래 내용은 **코드/설정 파일에 근거한 사실만** 적었습니다. 각 주장에는 (근거: 파일:라인) 표기를 붙였고, 필요한 경우 3~8줄로 짧게 인용했습니다.

## 1. 프로젝트 개요

- **프로젝트 명/브랜딩**: `SpotlightSeoul` (근거: `index.html:L7-L13`, `src/components/Footer.tsx:L8-L14`)
- **도메인(코드에서 유추 가능한 범위)**: “서울 축제/공연 정보” 탐색/조회 성격의 UI 문구가 존재합니다. (근거: `src/components/Banner.tsx:L11-L16`)

관련 코드(브랜딩/도메인 문구):

```txt
<title>SpotlightSeoul</title>
...
서울 축제, 공연 정보는 모두 여기에!
원하는 공연을 “Spotlight Seoul”에서 찾아보세요
```

- **주요 화면/라우트 목록(라우팅은 App에서 직접 선언)** (근거: `src/App.tsx:L1-L21`)
  - `/` → `MainPage` (근거: `src/App.tsx:L13-L16`, `src/pages/MainPage.tsx:L32-L33`)
  - `/detail/:id` → `DetailPage` (근거: `src/App.tsx:L14-L16`, `src/pages/DetailPage.tsx:L24-L26`)
  - `/login` → `LoginPage` (근거: `src/App.tsx:L16-L18`, `src/pages/LoginPage.tsx:L4-L6`)
  - `/signup` → `SignupPage` (근거: `src/App.tsx:L15-L17`, `src/pages/SignupPage.tsx:L4-L6`)

관련 코드(라우트 선언):

```tsx
<Routes>
  <Route path="/" element={<MainPage />} />
  <Route path="/detail/:id" element={<DetailPage />} />
  <Route path="/signup" element={<SignupPage />} />
  <Route path="/login" element={<LoginPage />} />
</Routes>
```

## 2. 기술 스택 & 의존성

- **빌드/번들러**: Vite 기반이며 `dev/build/lint/preview` 스크립트가 정의되어 있습니다. (근거: `package.json:L6-L11`)
- **핵심 런타임 의존성(발췌)** (근거: `package.json:L12-L27`)
  - React 18: `react`, `react-dom` (근거: `package.json:L19-L21`)
  - Router: `react-router-dom` (근거: `package.json:L24-L25`, `src/App.tsx:L1-L20`)
  - 전역 상태: `recoil` (근거: `package.json:L24-L26`, `src/App.tsx:L11-L21`)
  - HTTP: `axios` (근거: `package.json:L15-L17`, `src/pages/MainPage.tsx:L10-L11`)
  - 스타일: `tailwindcss`, `postcss`, `autoprefixer`, + `@material-tailwind/react` (근거: `package.json:L13-L20`)
  - UX/유틸: `react-intersection-observer`(무한스크롤 계열), `react-js-pagination`(페이지네이션 UI), `lottie-react`(배너 애니메이션) (근거: `package.json:L17-L23`, `src/pages/MainPage.tsx:L6-L8`, `src/components/Banner.tsx:L1-L3`)
  - 데이터 패칭 라이브러리(의존성 존재): `react-query@^3` (근거: `package.json:L21-L24`)

관련 코드(`scripts`):

```json
"scripts": {
  "dev": "vite",
  "build": "tsc && vite build",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
}
```

- **패키지 매니저/락파일 상태**: `yarn.lock`와 `package-lock.json`이 동시에 존재합니다(혼재 가능성). (근거: `yarn.lock:L1-L3`, `package-lock.json:L1-L6`)

관련 코드(락파일 헤더):

```txt
# yarn lockfile v1
```

```json
{
  "lockfileVersion": 3,
  "requires": true
}
```

## 3. 설정/툴링 현황

- **TypeScript(tsconfig)**
  - `strict: true` 및 미사용 변수/파라미터 금지 등 비교적 엄격한 옵션이 켜져 있습니다. (근거: `tsconfig.json:L17-L22`)
  - 번들러 모드 설정: `moduleResolution: "bundler"`, `isolatedModules: true`, `noEmit: true` 등 (근거: `tsconfig.json:L9-L21`)

관련 코드(tsconfig 핵심):

```json
"strict": true,
"noUnusedLocals": true,
"noUnusedParameters": true,
"noEmit": true
```

- **Vite 설정**
  - `server.host: '0.0.0.0'`로 외부(동일 네트워크) 접근을 허용하는 설정이 있습니다. (근거: `vite.config.ts:L5-L10`)

관련 코드(vite):

```ts
export default defineConfig({
  plugins: [react()],
  server: { host: '0.0.0.0' },
});
```

- **Tailwind/PostCSS**
  - Tailwind content 스캔 범위: `./src/**/*.{html,js,jsx,ts,tsx}` (근거: `tailwind.config.js:L1-L4`)
  - 커스텀 폰트 패밀리 등록: `LexendDeca`, `Pretendard` (근거: `tailwind.config.js:L6-L10`, `src/index.css:L5-L13`)
  - PostCSS 플러그인: `tailwindcss`, `autoprefixer` (근거: `postcss.config.js:L1-L6`)

관련 코드(font-face):

```css
@font-face { font-family: 'Lexend Deca'; src: url('./assets/fonts/LexendDeca-VariableFont_wght.ttf'); }
@font-face { font-family: 'Pretendard'; src: url('./assets/fonts/PretendardVariable.ttf'); }
```

- **ESLint/Prettier**
  - ESLint는 `airbnb` + `airbnb-typescript` + `prettier` 조합을 사용합니다. (근거: `.eslintrc.cjs:L4-L12`)
  - Prettier는 `prettier-plugin-tailwindcss`를 사용합니다. (근거: `.prettierrc:L1-L11`)

관련 코드(ESLint extends):

```js
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:@typescript-eslint/recommended',
  'airbnb',
  'airbnb-typescript',
  'plugin:prettier/recommended',
],
```

- **설정상 잠재 이슈(근거 있는 것만)**
  - ESLint `parserOptions.project`가 `'frontend/tsconfig.json'`로 지정되어 있습니다. 현재 워크스페이스 루트가 `frontend/`인 형태라면 상대경로 해석에 따라 tsconfig를 못 찾을 가능성이 있습니다. (근거: `.eslintrc.cjs:L13-L23`)  
    - 확인 방법: `npm run lint` 실행 시 `Parsing error: Cannot read file .../frontend/tsconfig.json` 류 에러가 나는지 확인. (근거: `package.json:L6-L11`, `.eslintrc.cjs:L14-L23`)
  - `package.json`에 `"proxy": "http://localhost:8080"`가 존재하지만, 실제 호출은 다수의 파일에서 **절대 URL**(`http://localhost:8080/...`)로 되어 있어 proxy 설정이 호출에 직접 적용되지 않습니다. (근거: `package.json:L55-L56`, `src/pages/MainPage.tsx:L52-L56`)

관련 코드(절대 URL 호출):

```ts
await axios.get(`http://localhost:8080/api/v1/festivals/page?offset=${page}&size=60`);
```

## 4. 아키텍처/폴더 구조

- **엔트리 흐름**
  - `index.html` → `src/main.tsx` → `src/App.tsx`로 이어집니다. (근거: `index.html:L9-L13`, `src/main.tsx:L1-L6`)
  - `main.tsx`에서는 `<App />`만 렌더하며, 별도의 Provider 구성은 `App.tsx` 내부에 있습니다. (근거: `src/main.tsx:L1-L6`)

관련 코드(엔트리 렌더):

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

- **Provider 구조**
  - 최상단 Provider는 `RecoilRoot` + `BrowserRouter`입니다. (근거: `src/App.tsx:L1-L21`)
  - `react-query`의 `QueryClientProvider` 등은 App/entry 레벨에서 확인되지 않습니다. (근거: `src/main.tsx:L1-L6`, `src/App.tsx:L9-L21`)

관련 코드(Provider):

```tsx
<RecoilRoot>
  <BrowserRouter>
    <Routes>...</Routes>
    <Footer />
  </BrowserRouter>
</RecoilRoot>
```

- **공통 레이어(api/utils/types) 존재 여부**
  - 별도의 `src/api/*`나 공통 fetch wrapper는 확인되지 않으며, `axios` 호출이 페이지/컴포넌트 파일에 직접 존재합니다. (근거: `src/pages/MainPage.tsx:L49-L76`, `src/components/NavBar.tsx:L39-L64`)

## 5. 기능 & 유저 플로우(실제로 무엇이 동작하는지)

### 5.1 목록 → 상세

- **목록(메인)에서 카드 클릭 시 상세로 이동**: `PostCard`에서 `navigate(\`/detail/${id}\`)` 수행. (근거: `src/components/PostCard.tsx:L38-L42`)
- **상세 진입 시 id 파라미터를 사용해 상세 API 호출**: `DetailPage`가 `useParams`로 `id`를 읽고 `GET /api/v1/festivals/:id` 호출. (근거: `src/pages/DetailPage.tsx:L25-L46`)

관련 코드(상세 호출):

```ts
const { id } = useParams<{ id: string }>();
const response = await axios.get<FestivalData>(`http://localhost:8080/api/v1/festivals/${id}`);
```

관련 파일:
- `src/components/PostCard.tsx` (근거: `src/components/PostCard.tsx:L1-L42`)
- `src/pages/DetailPage.tsx` (근거: `src/pages/DetailPage.tsx:L24-L69`)

### 5.2 검색(상단바) → 검색 결과를 메인 목록에 반영

- **Enter 키로 검색 실행**: `NavBar`에서 `onKeyDown`이 Enter면 `POST /api/v1/festivals`에 `{ title }`로 요청합니다. (근거: `src/components/NavBar.tsx:L36-L44`)
- **검색 결과를 Recoil atom에 저장 후 메인으로 이동**: `useSetRecoilState(searchResultsState)`로 결과 배열 저장 후 `navigate('/')`. (근거: `src/components/NavBar.tsx:L27-L61`, `src/RecoilState.ts:L14-L17`)
- **메인에서 Recoil 결과를 우선 렌더링**: `MainPage`가 `useRecoilValue(searchResultsState)`를 가져와 `searchResults.length > 0`이면 그 결과를 렌더합니다. (근거: `src/pages/MainPage.tsx:L44-L45`, `src/pages/MainPage.tsx:L160-L176`)

관련 코드(검색→전역상태 저장):

```ts
const setSearchResults = useSetRecoilState(searchResultsState);
const response = await axios.post('http://localhost:8080/api/v1/festivals', { title: searchTitle });
setSearchResults(postCardDataArray);
navigate('/');
```

관련 파일:
- `src/components/NavBar.tsx` (근거: `src/components/NavBar.tsx:L26-L68`)
- `src/RecoilState.ts` (근거: `src/RecoilState.ts:L3-L17`)
- `src/pages/MainPage.tsx` (근거: `src/pages/MainPage.tsx:L32-L45`, `src/pages/MainPage.tsx:L160-L189`)

### 5.3 목록 로딩(무한스크롤 성격) + 필터 조건에 따른 목록 변경

- **무한스크롤 트리거**: `useInView()`로 감지한 `inView`가 true일 때 `MainPostInformation()` 호출. (근거: `src/pages/MainPage.tsx:L46-L48`, `src/pages/MainPage.tsx:L91-L104`)
- **목록 API 호출 및 누적**: `GET /api/v1/festivals/page?offset=${page}&size=60` 후 `setTest(prev => [...prev, ...])` 및 `page + 1`. (근거: `src/pages/MainPage.tsx:L49-L58`)
- **필터 조건이 하나라도 있으면 필터 API 호출**: `GET /api/v1/festivals/category?...` 호출 후 결과로 `setTest(response)` (근거: `src/pages/MainPage.tsx:L64-L76`, `src/pages/MainPage.tsx:L104-L113`)

관련 코드(useEffect 분기):

```ts
if (searchResults.length > 0) setTest(searchResults);
else if (isFree === '' && startDate === '' && endDate === '' && field === '' && subField === '') {
  if (inView) MainPostInformation();
} else {
  FilterInformation();
}
```

관련 파일:
- `src/pages/MainPage.tsx` (근거: `src/pages/MainPage.tsx:L32-L113`, `src/pages/MainPage.tsx:L160-L195`)
- `src/components/Filter.tsx` (UI/상태 세터 전달) (근거: `src/components/Filter.tsx:L69-L81`)

### 5.4 좋아요(상세에서)

- **좋아요 증가 API 호출 존재**: 상세 페이지의 `FestivalInformation`에서 `PUT /api/v1/festivals/likes/:festivalId` 호출로 like 수를 업데이트합니다. (근거: `src/components/FestivalInformation.tsx:L43-L53`)
- **UI 상 상태**: 최초에는 `festivalLike` prop을, 클릭 후에는 `updatedLike` 상태를 표시합니다. (근거: `src/components/FestivalInformation.tsx:L40-L42`, `src/components/FestivalInformation.tsx:L81-L106`)

관련 코드(좋아요 요청):

```ts
const response = await axios.put(`http://localhost:8080/api/v1/festivals/likes/${festivalId}`);
setUpdatedLike(response.data.festival_like);
```

관련 파일:
- `src/components/FestivalInformation.tsx` (근거: `src/components/FestivalInformation.tsx:L26-L107`)
- `src/pages/DetailPage.tsx` (컴포넌트 사용) (근거: `src/pages/DetailPage.tsx:L70-L94`)

### 5.5 로그인/회원가입(현재 코드 기준)

- **로그인 버튼은 API 연동 없이 홈으로 이동**: `LoginPage`에서 버튼 클릭 시 `navigate('/')`. (근거: `src/pages/LoginPage.tsx:L31-L38`)
- **회원가입 버튼은 API 연동 없이 로그인으로 이동**: `SignupPage`에서 버튼 클릭 시 `navigate('/login')`. (근거: `src/pages/SignupPage.tsx:L34-L41`)

## 6. 상태 관리(전역/로컬) 스냅샷

- **Recoil 전역 상태(확인된 atom)**
  - `searchResultsState: atom<PostCardData[]>` (근거: `src/RecoilState.ts:L3-L17`)
  - 사용처:
    - 쓰기: `NavBar`(검색 결과 저장) (근거: `src/components/NavBar.tsx:L26-L61`)
    - 읽기: `MainPage`(검색 결과 우선 렌더) (근거: `src/pages/MainPage.tsx:L44-L45`, `src/pages/MainPage.tsx:L160-L176`)

관련 코드(atom 정의):

```ts
export const searchResultsState = atom<PostCardData[]>({
  key: 'searchResultsState',
  default: [],
});
```

- **페이지 로컬 state 패턴**
  - `MainPage`: 목록 데이터(`test`), 페이징(`page`), 필터 상태(`isFree/startDate/endDate/field/subField`)를 `useState`로 관리하고 `useEffect`에서 조건 분기합니다. (근거: `src/pages/MainPage.tsx:L32-L45`, `src/pages/MainPage.tsx:L91-L113`)
  - `DetailPage`: API 응답을 필드별 `useState`로 분해해서 저장합니다. (근거: `src/pages/DetailPage.tsx:L27-L40`, `src/pages/DetailPage.tsx:L47-L60`)

## 7. 데이터 패칭/에러/로딩 처리 스냅샷

- **API 호출 위치(파일별)**
  - 목록/필터 목록: `MainPage` (근거: `src/pages/MainPage.tsx:L49-L76`)
  - 상세 조회: `DetailPage` (근거: `src/pages/DetailPage.tsx:L41-L64`)
  - 검색: `NavBar` (근거: `src/components/NavBar.tsx:L36-L64`)
  - 좋아요: `FestivalInformation` (근거: `src/components/FestivalInformation.tsx:L43-L53`)

- **엔드포인트 하드코딩(HTTP baseURL 고정)**
  - `http://localhost:8080`가 위 4개 위치에서 반복 등장합니다. (근거: `src/pages/MainPage.tsx:L52-L56`, `src/pages/MainPage.tsx:L67-L70`, `src/pages/DetailPage.tsx:L44-L46`, `src/components/NavBar.tsx:L41-L44`, `src/components/FestivalInformation.tsx:L45-L47`)

- **에러 처리/로깅**
  - try/catch에서 `console.log(error)`를 수행하는 패턴이 다수입니다. (근거: `src/pages/MainPage.tsx:L59-L61`, `src/pages/DetailPage.tsx:L61-L63`, `src/components/NavBar.tsx:L62-L64`)
  - 입력값 검증은 `alert()`로 처리하는 구간이 있습니다(검색어 미입력). (근거: `src/components/NavBar.tsx:L65-L67`)

관련 코드(에러 처리/alert):

```ts
} catch (error) {
  console.log(error);
}
...
alert('검색어를 입력해주세요.');
```

- **로딩 처리**
  - 메인 목록은 `inView` 기반으로 “추가 호출”을 트리거하며, 별도 스피너/로딩 UI는 코드에서 확인되지 않습니다. (근거: `src/pages/MainPage.tsx:L46-L48`, `src/pages/MainPage.tsx:L101-L104`)
  - 지도는 `isMapLoaded` 플래그로 UI를 조건부 렌더링합니다. (근거: `src/components/MapInformation.tsx:L20-L22`, `src/components/MapInformation.tsx:L79-L81`)

- **react-query(의존성은 있으나 적용 근거는 entry 레벨에서 확인되지 않음)**
  - `react-query`는 의존성에 존재합니다. (근거: `package.json:L21-L24`)
  - 그러나 App/entry에 QueryClientProvider 구성은 확인되지 않습니다. (근거: `src/main.tsx:L1-L6`, `src/App.tsx:L9-L21`)

## 8. 외부 의존/키/보안/운영 리스크(근거 기반)

- **네이버 지도 스크립트 로딩 방식**
  - `index.html`에서 네이버 지도 스크립트를 전역으로 로드합니다. (근거: `index.html:L9-L13`)
  - `MapInformation`에서도 `typeof naver === 'undefined'`이면 스크립트를 동적으로 추가합니다(같은 clientId). (근거: `src/components/MapInformation.tsx:L60-L66`)
  - 즉, “전역 로드 + 런타임 로드 로직”이 동시에 존재합니다. (근거: `index.html:L12-L13`, `src/components/MapInformation.tsx:L60-L66`)

관련 코드(지도 스크립트):

```html
<script src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=2nezq8tgn5"></script>
```

```ts
if (typeof naver === 'undefined') {
  loadScript('https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=2nezq8tgn5', initMap);
}
```

- **clientId 하드코딩**
  - `ncpClientId=2nezq8tgn5`가 HTML/TSX에 직접 포함되어 있습니다. (근거: `index.html:L12-L13`, `src/components/MapInformation.tsx:L63-L66`)

- **localhost 고정**
  - API base가 `http://localhost:8080`로 하드코딩되어 있어 배포/환경 분리 관점에서 운영 리스크가 있습니다. (근거: `src/pages/MainPage.tsx:L52-L56`, `src/pages/DetailPage.tsx:L44-L46`)

- **env 사용 여부**
  - Vite env 접근(`import.meta.env`)은 주요 엔드포인트/키 위치에서 확인되지 않습니다. (근거: `src/pages/MainPage.tsx:L49-L76`, `src/components/MapInformation.tsx:L60-L66`)  
    - 확인 방법(추가): 레포 전체에서 `import.meta.env`/`VITE_` 문자열 검색. (확인이 필요합니다)

- **지도 구현 잠재 이슈(코드 흐름 기반)**
  - `initMap()`는 `document.getElementById('map')`가 있을 때만 Map을 생성하는데, 실제 `#map` div는 `isMapLoaded && (...)` 조건으로 렌더됩니다. 초기에는 `isMapLoaded=false`이므로 `initMap()` 호출 시점에 컨테이너가 없을 수 있습니다. (근거: `src/components/MapInformation.tsx:L36-L40`, `src/components/MapInformation.tsx:L56-L58`, `src/components/MapInformation.tsx:L79-L81`)
  - 확인 방법: 상세 페이지에서 “위치 안내” 아래 지도 컨테이너가 실제로 렌더/표시되는지 확인. (근거: `src/pages/DetailPage.tsx:L91-L93`, `src/components/MapInformation.tsx:L72-L82`)

## 9. 품질/유지보수성 체크(근거 기반)

- **타입/모델 정의 중복**
  - `PostCardData` 타입이 `src/RecoilState.ts`와 `src/pages/MainPage.tsx`에 각각 정의되어 중복 가능성이 있습니다. (근거: `src/RecoilState.ts:L3-L12`, `src/pages/MainPage.tsx:L12-L21`)

- **`any` 사용**
  - `Filter.tsx`에서 이벤트 타입이 `any`로 사용됩니다. (근거: `src/components/Filter.tsx:L138-L145`)

관련 코드(any):

```ts
onChange={(e: any) => {
  console.log('start', e.target.value);
}}
```

- **SPA 네비게이션 일관성**
  - Router의 `navigate()`와 `window.location.href`가 혼용됩니다. (근거: `src/components/NavBar.tsx:L76-L82`, `src/components/NavBar.tsx:L99-L103`)

- **필터 UI ↔ 실제 필터 상태 연결 불완전(코드상)**
  - `Filter` 컴포넌트는 `setStartDate`, `setEndDate`, `setSubField`를 props로 받지만, 날짜 input은 `console.log`만 하고 setter 호출이 보이지 않으며, “세부분야” select에도 `onChange`가 없습니다. (근거: `src/components/Filter.tsx:L69-L81`, `src/components/Filter.tsx:L126-L152`)

- **테스트 존재 여부(스크립트 기준)**
  - `package.json` scripts에 `test`가 없습니다. (근거: `package.json:L6-L11`)

## 10. 비교를 위한 Baseline Metrics (지금 당장 측정 가능한 것만)

- **라우트 수(정의 기준: App에서 선언된 Route 수)**: 4개 (근거: `src/App.tsx:L13-L18`)
- **페이지 파일 수(정의 기준: `src/pages/*.tsx`)**: 4개 (`MainPage`, `DetailPage`, `LoginPage`, `SignupPage`) (근거: `src/App.tsx:L3-L6`, `src/pages/MainPage.tsx:L32-L33`, `src/pages/DetailPage.tsx:L24-L26`, `src/pages/LoginPage.tsx:L4-L6`, `src/pages/SignupPage.tsx:L4-L6`)
- **컴포넌트(.tsx) 파일(문서 범위에서 확인된 목록)**: 8개
  - `Banner`, `FestivalInformation`, `Filter`, `Footer`, `MapInformation`, `NavBar`, `Paging`, `PostCard` (근거: `src/components/Banner.tsx:L1-L6`, `src/components/FestivalInformation.tsx:L1-L6`, `src/components/Filter.tsx:L69-L81`, `src/components/Footer.tsx:L4-L11`, `src/components/MapInformation.tsx:L13-L22`, `src/components/NavBar.tsx:L26-L33`, `src/components/Paging.tsx:L1-L4`, `src/components/PostCard.tsx:L1-L4`)
- **localhost 하드코딩(정의 기준: `http://localhost:8080` 문자열 등장 위치)**: 5곳
  - `MainPage` 2곳(페이지/카테고리) (근거: `src/pages/MainPage.tsx:L52-L56`, `src/pages/MainPage.tsx:L67-L70`)
  - `DetailPage` 1곳(상세) (근거: `src/pages/DetailPage.tsx:L44-L46`)
  - `NavBar` 1곳(검색) (근거: `src/components/NavBar.tsx:L41-L44`)
  - `FestivalInformation` 1곳(좋아요) (근거: `src/components/FestivalInformation.tsx:L45-L47`)
- **네이버 지도 clientId 하드코딩(정의 기준: `ncpClientId=`가 포함된 스크립트 URL)**: 2곳 (근거: `index.html:L12-L13`, `src/components/MapInformation.tsx:L63-L66`)

비교 지표로 추가 제안(모두 코드로 측정 가능):
- `console.log(` 호출 라인 수 (근거: `src/pages/MainPage.tsx:L58-L61`, `src/components/FestivalInformation.tsx:L50-L53`)
- `window.location.href` 사용 라인 수 (근거: `src/components/NavBar.tsx:L76-L82`)
- `any` 사용 라인 수 (근거: `src/components/Filter.tsx:L138-L145`)

## 부록 A. Evidence Index

> 파일별로 “무엇을 증명하는지”를 한 줄로 정리했습니다.

- `package.json:L6-L56` — 스크립트/의존성/`proxy` 설정 (근거: `package.json:L6-L56`)
- `yarn.lock:L1-L3` — Yarn 락파일 존재 (혼재 가능성) (근거: `yarn.lock:L1-L3`)
- `package-lock.json:L1-L6` — npm 락파일 존재 (혼재 가능성) (근거: `package-lock.json:L1-L6`)
- `vite.config.ts:L5-L10` — Vite 서버 host 설정 (근거: `vite.config.ts:L5-L10`)
- `tsconfig.json:L9-L22` — TS strict 및 번들러 모드 옵션 (근거: `tsconfig.json:L9-L22`)
- `tailwind.config.js:L1-L12` — Tailwind content 스캔/폰트 설정 (근거: `tailwind.config.js:L1-L12`)
- `postcss.config.js:L1-L6` — PostCSS 플러그인 (근거: `postcss.config.js:L1-L6`)
- `.eslintrc.cjs:L4-L23` — ESLint extends + `parserOptions.project` 경로 (근거: `.eslintrc.cjs:L4-L23`)
- `.prettierrc:L1-L11` — Prettier 옵션 + tailwind 플러그인 (근거: `.prettierrc:L1-L11`)
- `index.html:L9-L13` — 엔트리/네이버 지도 스크립트 전역 로드 (근거: `index.html:L9-L13`)
- `src/main.tsx:L1-L6` — React 엔트리 렌더링 (근거: `src/main.tsx:L1-L6`)
- `src/App.tsx:L1-L21` — Router + RecoilRoot + 라우트 목록 (근거: `src/App.tsx:L1-L21`)
- `src/RecoilState.ts:L3-L17` — `searchResultsState` atom 정의 (근거: `src/RecoilState.ts:L3-L17`)
- `src/pages/MainPage.tsx:L32-L113` — 메인 목록/무한스크롤/필터 분기 + API 호출 (근거: `src/pages/MainPage.tsx:L32-L113`)
- `src/pages/DetailPage.tsx:L41-L68` — 상세 조회 API 호출 및 state 매핑 (근거: `src/pages/DetailPage.tsx:L41-L68`)
- `src/components/NavBar.tsx:L36-L67` — 검색 API + Recoil 저장 + alert 처리 (근거: `src/components/NavBar.tsx:L36-L67`)
- `src/components/PostCard.tsx:L38-L42` — 상세로 navigate (근거: `src/components/PostCard.tsx:L38-L42`)
- `src/components/FestivalInformation.tsx:L43-L53` — 좋아요 PUT 호출 (근거: `src/components/FestivalInformation.tsx:L43-L53`)
- `src/components/MapInformation.tsx:L60-L81` — 지도 스크립트 로드/조건부 렌더링 (근거: `src/components/MapInformation.tsx:L60-L81`)
- `src/pages/LoginPage.tsx:L31-L38` — 로그인 버튼은 navigate만 수행 (근거: `src/pages/LoginPage.tsx:L31-L38`)
- `src/pages/SignupPage.tsx:L34-L41` — 회원가입 버튼은 navigate만 수행 (근거: `src/pages/SignupPage.tsx:L34-L41`)
- `src/index.css:L1-L13` — Tailwind directives + 폰트 로드 (근거: `src/index.css:L1-L13`)

---

## As-Is 결론 5줄 요약(근거 링크 포함)

1) 이 프로젝트는 Vite + React 18 + TS(strict) 기반의 SPA이며, 라우팅은 `App.tsx`에서 직접 선언됩니다. (근거: `package.json:L6-L11`, `tsconfig.json:L17-L22`, `src/App.tsx:L1-L21`)  
2) 전역 상태는 Recoil을 사용하며, 확인된 atom은 `searchResultsState` 1개로 “검색 결과 전달”에 사용됩니다. (근거: `src/App.tsx:L11-L21`, `src/RecoilState.ts:L14-L17`, `src/components/NavBar.tsx:L27-L61`)  
3) 데이터 패칭은 axios를 페이지/컴포넌트에서 직접 호출하며, baseURL이 `http://localhost:8080`로 하드코딩되어 있습니다(총 5곳). (근거: `src/pages/MainPage.tsx:L52-L70`, `src/pages/DetailPage.tsx:L44-L46`, `src/components/NavBar.tsx:L41-L44`, `src/components/FestivalInformation.tsx:L45-L47`)  
4) 네이버 지도는 clientId가 코드에 하드코딩되어 있고, `index.html` 전역 로드 + 컴포넌트 동적 로드 로직이 동시에 존재합니다. (근거: `index.html:L12-L13`, `src/components/MapInformation.tsx:L60-L66`)  
5) 로그인/회원가입은 현재 UI 이동만 존재하며, 테스트 스크립트는 정의되어 있지 않습니다. (근거: `src/pages/LoginPage.tsx:L31-L38`, `src/pages/SignupPage.tsx:L34-L41`, `package.json:L6-L11`)

