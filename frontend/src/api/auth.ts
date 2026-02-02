import { apiClient } from './client';
import type { UserLoginRequest, UserLoginResponse } from './types/user/auth';

export default async function login(
  credentials: UserLoginRequest,
): Promise<UserLoginResponse> {
  const response = await apiClient.post<UserLoginResponse>(
    '/api/v1/login',
    credentials,
  );
  return response.data;
}
