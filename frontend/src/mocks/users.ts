import type {
  ErrorResponse,
  FestivalResponse,
  PageResponse,
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserResponse,
} from '@/api/types';
import type { SelectOption } from '@/components/ui';
import { mockFestivalListPage } from '@/mocks/festivals';

export const mockUser: UserResponse = {
  id: 'u_1',
  username: '홍길동',
  email: 'hong@example.com',
  location: '중구',
  created_at: '2026-02-01T09:00:00Z',
  updated_at: '2026-02-01T09:00:00Z',
  deleted_at: null,
};

export const mockLoginRequest: UserLoginRequest = {
  email: 'hong@example.com',
  password: 'password1234',
};

export const mockSignupRequest: UserCreateRequest = {
  username: '홍길동',
  email: 'hong@example.com',
  password: 'password1234',
  location: '중구',
};

export const mockLoginResponse: UserLoginResponse = {
  access_token: 'mock_access_token',
};

export const mockLoginError: ErrorResponse = {
  requestId: 'mock_req_login_error',
  statusCode: 401,
  code: 'UNAUTHORIZED',
  message: '이메일 또는 비밀번호가 올바르지 않습니다.',
};

export const mockSignupError: ErrorResponse = {
  requestId: 'mock_req_signup_error',
  statusCode: 409,
  code: 'CONFLICT',
  message: '이미 사용 중인 이메일입니다.',
};

export const SEOUL_GU_OPTIONS: SelectOption[] = [
  { label: '강남구', value: '강남구' },
  { label: '강동구', value: '강동구' },
  { label: '강북구', value: '강북구' },
  { label: '강서구', value: '강서구' },
  { label: '관악구', value: '관악구' },
  { label: '광진구', value: '광진구' },
  { label: '구로구', value: '구로구' },
  { label: '금천구', value: '금천구' },
  { label: '노원구', value: '노원구' },
  { label: '도봉구', value: '도봉구' },
  { label: '동대문구', value: '동대문구' },
  { label: '동작구', value: '동작구' },
  { label: '마포구', value: '마포구' },
  { label: '서대문구', value: '서대문구' },
  { label: '서초구', value: '서초구' },
  { label: '성동구', value: '성동구' },
  { label: '성북구', value: '성북구' },
  { label: '송파구', value: '송파구' },
  { label: '양천구', value: '양천구' },
  { label: '영등포구', value: '영등포구' },
  { label: '용산구', value: '용산구' },
  { label: '은평구', value: '은평구' },
  { label: '종로구', value: '종로구' },
  { label: '중구', value: '중구' },
  { label: '중랑구', value: '중랑구' },
];

export const mockBookmarkPage: PageResponse<FestivalResponse> = {
  total_page_num: 2,
  // 페이지네이션 UI 테스트를 위해 2페이지 분량(4개 * 2) 정도를 준비합니다.
  post_responses: mockFestivalListPage.post_responses.slice(0, 8),
};

export const mockBookmarkEmpty: PageResponse<FestivalResponse> = {
  total_page_num: 0,
  post_responses: [],
};
