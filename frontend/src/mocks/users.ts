import type {
  UserCreateRequest,
  UserLoginRequest,
  UserLoginResponse,
  UserResponse,
} from '@/api/types';

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
