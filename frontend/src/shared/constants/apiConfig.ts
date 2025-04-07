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
  POSTS: {
    LIST: "/api/posts", // 게시글 목록 조회 (GET)
    DETAIL: (postId: number) => `/api/posts/${postId}`, // 게시글 상세 조회 (GET)
    CREATE: "/api/posts", // 게시글 생성 (POST)
    UPDATE: (postId: number) => `/api/posts/${postId}`, // 게시글 수정 (PUT)
    DELETE: (postId: number) => `/api/posts/${postId}`, // 게시글 삭제 (DELETE)
    MY_POSTS: "/api/users/posts", // 내가 작성한 게시글 목록 조회
    MY_LIKES: "/api/users/likes/posts", // 내가 좋아요한 게시글 목록 조회
    MY_SCRAPS: "/api/users/scraps/posts", // 내가 스크랩한 게시글 목록 조회
  },

  // 댓글 관련 API 경로
  COMMENTS: {
    CREATE: "/api/comments", // 댓글 생성 (POST)
    UPDATE: (commentId: number) => `/api/comments/${commentId}`, // 댓글 수정 (PUT)
    DELETE: (commentId: number) => `/api/comments/${commentId}`, // 댓글 삭제 (DELETE)
    REPLIES: (commentId: number) => `/api/comments/${commentId}/replies`, // 대댓글 목록 조회 (GET)
    MY_COMMENTS: "/api/users/comments", // 내가 작성한 댓글 목록 조회
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

  // 이미지 업로드 관련 API 경로
  IMAGE: {
    PRESIGNED_URL: "/api/presigned-url", // 이미지 업로드용 presigned-url 조회
  },

  // 신고 관련 API 경로
  REPORT: {
    CREATE: "/api/reports", // 신고 생성 (POST)
  },
};
