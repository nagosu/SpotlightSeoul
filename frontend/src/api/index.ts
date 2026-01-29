// axios 인스턴스 export
export { apiClient, default as api } from './client';

// 공통 타입 export
export type { FieldError, ErrorResponse, PageResponse } from './types/common';

// Festival 타입 export
export type {
  FestivalResponse,
  FestivalDetailResponse,
  FestivalFilterResponse,
  FestivalSearchResponse,
  FestivalNearResponse,
  FestivalMostResponse,
  FestivalLikeResponse,
  FestivalLikeToggleResponse,
  FestivalBookmarkToggleResponse,
  FestivalSuggestResponse,
  FestivalSearchRequest,
  FestivalListParams,
  FestivalNearParams,
  FestivalSuggestParams,
} from './types/festival';

// User 타입 export
export type {
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserUpdateRequest,
  UserResponse,
} from './types/user';
