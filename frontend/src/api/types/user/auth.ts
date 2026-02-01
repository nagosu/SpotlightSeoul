/**
 * 로그인 요청 (Swagger UserLoginRequest 스키마)
 */
export interface UserLoginRequest {
  /** 이메일 */
  email: string;
  /** 비밀번호 */
  password: string;
}

/**
 * 로그인 응답 (Swagger UserLoginResponse 스키마)
 */
export interface UserLoginResponse {
  /** Bearer 인증용 Access Token (JWT) */
  access_token: string;
}
