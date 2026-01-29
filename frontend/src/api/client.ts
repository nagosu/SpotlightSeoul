import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // X-Request-Id 헤더 자동 추가 (없는 경우에만)
    if (!config.headers['X-Request-Id']) {
      config.headers['X-Request-Id'] = uuidv4();
    }

    // Authorization Bearer 토큰 자동 추가 (로컬스토리지에서 가져오기)
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  (error: AxiosError) => {
    // 에러 응답 정규화
    if (error.response) {
      // 서버에서 응답이 온 경우 (4xx, 5xx)
      const errorData = error.response.data;
      return Promise.reject(errorData);
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      return Promise.reject({
        requestId: 'network-error',
        statusCode: 0,
        code: 'NETWORK_ERROR',
        message: '네트워크 연결을 확인해주세요.',
      });
    } else {
      // 요청 설정 중 오류 발생
      return Promise.reject({
        requestId: 'unknown-error',
        statusCode: 0,
        code: 'UNKNOWN_ERROR',
        message: '알 수 없는 오류가 발생했습니다.',
      });
    }
  },
);

export default apiClient;
