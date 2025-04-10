/**
 * 좋아요 관련 API 연결을 담당하는 서비스 레이어
 * LikeButton 컴포넌트에서 사용할 API 요청 함수들을 제공합니다.
 *
 * 백엔드 API는 응답 데이터 없이 성공/실패만 반환합니다.
 */

import { apiPost } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse, LikeRequest } from "../types/apiTypes";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 서비스 - 좋아요 관련 API 요청 함수 모음
 */
export const LikeService = {
  /**
   * 백엔드 서버와 통신하여 좋아요 상태를 토글합니다.
   * 이 함수는 API 호출만 담당하며, 응답 데이터가 없습니다.
   *
   * @param targetId 좋아요 대상 ID (게시글, 댓글 등)
   * @param targetType 좋아요 대상 타입 ("POST", "POST_COMMENT" 등)
   * @returns 성공/실패 응답만 포함된 Promise 객체
   */
  callToggleLikeApi: async (
    targetId: number,
    targetType: TargetType
  ): Promise<ApiResponse<any> | null> => {
    // 요청 데이터 생성
    const requestData: LikeRequest = {
      targetId,
      targetType,
    };

    try {
      console.log(`[API Request] 좋아요 토글: ${targetType} ${targetId}`);

      // API 호출 - 백엔드는 성공/실패만 반환
      const response = await apiPost<any>(API_PATHS.LIKES.TOGGLE, requestData);

      // 응답이 null/undefined인 경우 경고 로그 및 기본 응답 반환 (백엔드 명세상 데이터 없음)
      if (response === null || response === undefined) {
        console.warn(
          `[API Response] ${targetType} ${targetId} 좋아요 API 응답 없음 (정상)`
        );
        // 성공으로 간주하고 기본 응답 구조 반환
        return {
          success: true,
          message: "API 응답 없음 (데이터 없음)",
          data: null, // 명시적으로 null 설정
        };
      }

      // 백엔드에서 예상치 못한 데이터가 오는 경우 로그 (디버깅 목적)
      if (response.data) {
        console.warn(
          `[API Response] ${targetType} ${targetId} 예상치 못한 응답 데이터 수신:`,
          response.data
        );
      }

      // API 클라이언트에서 가공된 응답 반환 (success, message 등 포함)
      return response;
    } catch (error) {
      console.error(
        `[API Error] ${targetType} ${targetId} 좋아요 처리 중 오류 발생:`,
        error
      );

      // 오류 발생 시 실패 응답 반환
      return {
        success: false,
        message: "좋아요 처리 중 오류 발생",
        data: null,
        error: {
          code: "API_ERROR",
          message: error instanceof Error ? error.message : "알 수 없는 오류",
        },
      } as ApiResponse<any>;
    }
  },
};
