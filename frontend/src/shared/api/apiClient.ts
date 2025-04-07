/**
 * API 요청을 관리하는 클라이언트 설정 파일
 * 기존의 axiosInstance.ts 기능을 확장하여 좋아요 API 연결을 지원합니다.
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  API_BASE_URL,
  API_TIMEOUT,
  AUTH_ERROR_CODES,
} from "../constants/apiConfig";
import { useAuthStore } from "../stores/auth";
import { ApiResponse, ApiError } from "../types/apiTypes";

// 기본 axios 인스턴스 생성 (기존 코드와 일치)
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // 쿠키 전송을 위한 설정 (기존 코드와 일치)
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (기존 코드와 일치)
apiClient.interceptors.request.use(
  (config) => {
    const { user } = useAuthStore.getState();
    const accessToken = user?.accessToken;

    // 개발 로그 (디버깅용)
    console.log(`📤 API 요청: ${config.method?.toUpperCase()} ${config.url}`);

    // 토큰이 있다면 헤더에 추가
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러 처리
    console.error("❌ API 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (기존 코드와 일치, 약간의 개선)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 데이터 로깅
    console.log(
      `📥 API 응답 [${
        response.status
      }]: ${response.config.method?.toUpperCase()} ${response.config.url}`
    );

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const { user, updateAccessToken, logOut } = useAuthStore.getState();
    const accessToken = user?.accessToken;

    // 에러 로깅
    console.error("API 응답 에러:", error.response?.data);

    // 토큰 만료 에러 확인 (기존 코드와 일치)
    const isTokenExpired =
      error.response?.data?.code === AUTH_ERROR_CODES.TOKEN_EXPIRED;

    // 토큰 재발급 로직 (기존 코드와 일치)
    if (isTokenExpired && !originalRequest._retry && accessToken) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급 요청
        const response = await axios.post(
          `${API_BASE_URL}/api/auth/reissue`,
          null,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            withCredentials: true,
          }
        );

        const authHeader = response.headers["authorization"]; // "Bearer {newAccessToken}"

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new Error("Authorization 헤더가 없거나 형식이 잘못되었습니다.");
        }

        // 새 토큰 추출 및 저장
        const newAccessToken = authHeader.split(" ")[1];
        updateAccessToken(newAccessToken);

        // 원래 요청 재시도
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(originalRequest);
      } catch (error: any) {
        console.error("토큰 재발급 에러:", error);
        if (error.response) {
          console.error(error.response.data);
        } else {
          console.error("네트워크 오류 또는 알 수 없는 오류 발생");
        }
        // 재발급 실패 시 로그아웃
        logOut();
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API 요청 함수 (재사용 가능)
 * @param method HTTP 메소드
 * @param url API 경로
 * @param data 요청 데이터 (옵션)
 * @param config 추가 설정 (옵션)
 * @returns Promise 객체
 */
export const apiRequest = async <T>(
  method: string,
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    // 에러 로깅 후 다시 throw
    console.error(`API 요청 실패: ${method} ${url}`, error);
    throw error;
  }
};

// 편의성을 위한 HTTP 메소드별 함수
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("get", url, undefined, config);

export const apiPost = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiRequest<T>("post", url, data, config);

export const apiPut = <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig
) => apiRequest<T>("put", url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("delete", url, undefined, config);

// 기존 axiosInstance 내보내기 (하위 호환성 유지)
export default apiClient;
