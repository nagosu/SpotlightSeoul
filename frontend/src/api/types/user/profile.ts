/**
 * 회원가입 요청 (Swagger UserCreateRequest 스키마)
 */
export interface UserCreateRequest {
  /** 닉네임 */
  username: string;
  /** 비밀번호 */
  password: string;
  /** 이메일 */
  email: string;
  /** 거주 지역/선호 지역 */
  location: string;
}

/**
 * 회원수정 요청 (Swagger UserUpdateRequest 스키마)
 */
export interface UserUpdateRequest {
  /** 회원 ID */
  id: string;
  /** 닉네임 */
  username: string;
  /** 비밀번호 */
  password: string;
  /** 이메일 */
  email: string;
  /** 거주 지역/선호 지역 */
  location: string;
}

/**
 * 회원 정보 응답 (Swagger UserResponse 스키마)
 */
export interface UserResponse {
  /** 회원 ID */
  id: string;
  /** 닉네임 */
  username: string;
  /** 이메일 */
  email: string;
  /** 거주 지역/선호 지역 */
  location: string;
  /** 생성 시각 (ISO 문자열) */
  created_at: string;
  /** 수정 시각 (ISO 문자열) */
  updated_at: string;
  /** 삭제 시각 (소프트삭제, ISO 문자열). 미삭제 시 null */
  deleted_at: string | null;
}
