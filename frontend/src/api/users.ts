import { apiClient } from './client';
import type { PageResponse } from './types/common';
import type { FestivalResponse } from './types/festival';
import type {
  UserCreateRequest,
  UserResponse,
  UserUpdateRequest,
} from './types/user';

/**
 * 회원가입
 */
export async function createUser(
  body: UserCreateRequest,
): Promise<UserResponse> {
  const response = await apiClient.post<UserResponse>('/api/v1/users', body);
  return response.data;
}

/**
 * 회원수정(로그인 필요할 수 있음: 스펙 표기 불일치 가능)
 */
export async function updateUser(
  body: UserUpdateRequest,
): Promise<UserResponse> {
  const response = await apiClient.put<UserResponse>('/api/v1/users', body, {
    withAuthToken: true,
  });
  return response.data;
}

/**
 * 회원조회(로그인 필요)
 */
export async function getUserById(userId: string): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(
    `/api/v1/users/${userId}`,
    {
      withAuthToken: true,
    },
  );
  return response.data;
}

/**
 * 회원탈퇴(소프트삭제, 로그인 필요할 수 있음: 스펙 표기 불일치 가능)
 */
export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete<void>(`/api/v1/users/${id}`, { withAuthToken: true });
}

/**
 * 내 북마크(찜) 목록(로그인 필요)
 */
export async function getMyBookmarks(params?: {
  page?: number;
  size?: number;
}): Promise<PageResponse<FestivalResponse>> {
  const response = await apiClient.get<PageResponse<FestivalResponse>>(
    '/api/v1/users/me/bookmarks',
    { params, withAuthToken: true },
  );
  return response.data;
}
