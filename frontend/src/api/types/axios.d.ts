import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * true일 때만 Authorization(Bearer) 토큰을 헤더에 첨부합니다.
     * axios 기본 옵션 `auth`(Basic Auth)와 이름 충돌을 피하기 위해 별도 플래그를 사용합니다.
     */
    withAuthToken?: boolean;
  }
}
