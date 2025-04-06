/**
 * API 응답 및 요청 관련 타입 정의
 * 백엔드 API와 통신할 때 사용할 데이터 타입을 명확히 정의합니다.
 */

// LikeButton 컴포넌트와 일관된 타입 정의를 위한 import
import { TargetType } from "../../components/LikeButton/LikeButton.types";

// API 기본 응답 구조
export interface ApiResponse<T> {
  data?: T; // 실제 데이터
  message?: string; // 메시지 (선택 사항)
  code?: number; // 백엔드 에러 코드 (기존 코드와 일치)
  success?: boolean; // 요청 성공 여부
  statusCode?: number; // HTTP 상태 코드
}

// 인증 관련 타입
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface User {
  id: number;
  nickname: string;
  email: string;
  profileImage?: string;
  accessToken?: string; // 기존 코드와 일치
  // 추가 사용자 정보
}

// 좋아요 요청 전송 시 사용할 타입
export interface LikeRequest {
  targetId: number; // 좋아요 대상 ID
  targetType: TargetType; // 좋아요 대상 타입 (POST, POST_COMMENT 등)
}

// 좋아요 토글 응답 데이터 타입
export interface LikeResponse {
  targetId: number; // 좋아요 대상 ID
  targetType: TargetType; // 좋아요 대상 타입
  isLiked: boolean; // 좋아요 상태
  likeCount: number; // 좋아요 수
}

// 페이지네이션 응답에 포함될 메타 정보
export interface PaginationMeta {
  currentPage?: number; // 현재 페이지
  totalPages?: number; // 전체 페이지 수
  totalItems?: number; // 전체 아이템 수
  itemsPerPage?: number; // 페이지당 아이템 수
  nextCursorId?: number; // 다음 페이지 커서 ID (커서 기반 페이지네이션용)
}

// 페이지네이션 포함 응답 타입
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta;
}

// 에러 응답 타입
export interface ApiError {
  code: number; // 백엔드 에러 코드 (기존 코드와 일치)
  message: string; // 에러 메시지
  errors?: Record<string, string[]>; // 필드별 에러 목록
}
