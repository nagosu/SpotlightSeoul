import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { useAuthStore } from '@/stores/useAuthStore';
import {
  createUser,
  deleteUser,
  login,
  updateUser,
  type UserCreateRequest,
  type UserLoginRequest,
  type UserLoginResponse,
  type UserResponse,
  type UserUpdateRequest,
} from '@/api';
import { queryKeys } from '@/lib/queryKeys';

export function useCreateUserMutation(
  options?: UseMutationOptions<UserResponse, unknown, UserCreateRequest>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (body: UserCreateRequest) => createUser(body),
    ...rest,
    onSuccess: async (data, variables, ctx, mutation) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user._def });
      await onSuccess?.(data, variables, ctx, mutation);
    },
  });
}

export function useUpdateUserMutation(
  options?: UseMutationOptions<UserResponse, unknown, UserUpdateRequest>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (body: UserUpdateRequest) => updateUser(body),
    ...rest,
    onSuccess: async (data, variables, ctx, mutation) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user._def });
      await onSuccess?.(data, variables, ctx, mutation);
    },
  });
}

export function useDeleteUserMutation(
  options?: UseMutationOptions<void, unknown, string>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    ...rest,
    onSuccess: async (data, variables, ctx, mutation) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.user._def });
      await onSuccess?.(data, variables, ctx, mutation);
    },
  });
}

export function useLoginMutation(
  options?: UseMutationOptions<UserLoginResponse, unknown, UserLoginRequest>,
) {
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: (credentials: UserLoginRequest) => login(credentials),
    ...rest,
    onSuccess: async (data, variables, ctx, mutation) => {
      // 로그인 응답은 토큰만 내려오므로, 스토어에 저장해 인증 상태를 갱신합니다.
      useAuthStore.getState().login(data.access_token);
      await onSuccess?.(data, variables, ctx, mutation);
    },
  });
}

