// axios 인스턴스 export
export { apiClient, default as api } from './client';

// 공통 타입 export (명시적으로 공개 API만 노출)
export type { ApiError, FieldError, ErrorResponse, PageResponse } from './types/common';

// Festival 타입 export (명시적으로 공개 API만 노출)
export type {
  FestivalBase,
  FestivalCardBase,
  FestivalFull,
  FestivalResponse,
  FestivalDetailResponse,
  FestivalFilterResponse,
  FestivalSearchRequest,
  FestivalSearchResponse,
  FestivalSuggestResponse,
  FestivalSuggestParams,
  FestivalNearResponse,
  FestivalNearParams,
  FestivalLikeResponse,
  FestivalLikeToggleResponse,
  FestivalBookmarkToggleResponse,
  FestivalMostResponse,
  FestivalListParams,
} from './types/festival';

// User 타입 export (명시적으로 공개 API만 노출)
export type {
  UserLoginRequest,
  UserLoginResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
} from './types/user';
