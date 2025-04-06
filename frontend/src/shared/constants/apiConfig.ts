/**
 * API 환경 설정을 관리하는 파일
 * 백엔드 서버 연결에 필요한 상수와 경로를 중앙에서 관리합니다.
 */

// 백엔드 서버의 기본 URL (기존 환경변수 재사용)
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

// API 요청 시 적용할 기본 타임아웃 (밀리초 단위)
export const API_TIMEOUT = 10000; // 10초

// API 응답에 대한 상태 코드
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// 인증 관련 에러 코드 (기존 코드에서 추출)
export const AUTH_ERROR_CODES = {
  TOKEN_EXPIRED: 3002,
  // 필요한 다른 에러 코드 추가
};

// API 경로 정의
export const API_PATHS = {
  // 인증 관련 API 경로
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    REISSUE: "/api/auth/reissue",
    LOGOUT: "/api/auth/logout",
  },

  // 게시판 관련 API 경로
  BOARD: {
    POSTS: "/api/posts",
    COMMENTS: "/api/comments",
  },

  // 좋아요 관련 API 경로
  LIKES: {
    TOGGLE: "/api/likes",
    STATUS: "/api/likes",
  },

  // 사용자 관련 API 경로
  USER: {
    PROFILE: "/api/users/profile",
    UPDATE: "/api/users/update",
  },
};
