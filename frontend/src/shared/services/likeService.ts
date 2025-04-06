/**
 * 좋아요 관련 API 연결을 담당하는 서비스 레이어
 * LikeButton 컴포넌트에서 사용할 API 요청 함수들을 제공합니다.
 */

import { apiGet, apiPost } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse, LikeRequest, LikeResponse } from "../types/apiTypes";

/**
 * 좋아요 서비스 - 좋아요 관련 API 요청 함수 모음
 */
export const LikeService = {
  /**
   * 좋아요 상태 토글 (좋아요 추가/취소)
   *
   * @param targetId 좋아요 대상 ID (게시글, 댓글 등)
   * @param targetType 좋아요 대상 타입 ("POST", "POST_COMMENT" 등)
   * @returns 토글 후 상태를 담은 Promise 객체
   *
   * @example
   * // 게시글 좋아요 토글
   * const result = await LikeService.toggleLike(123, "POST");
   * console.log(`좋아요 ${result.isLiked ? '추가' : '취소'} 완료, 현재 개수: ${result.likeCount}`);
   */
  toggleLike: async (
    targetId: number,
    targetType: string
  ): Promise<LikeResponse> => {
    try {
      // 요청 데이터 생성
      const requestData: LikeRequest = {
        targetId,
        targetType,
      };

      // API 호출
      const response = await apiPost<LikeResponse>(
        API_PATHS.LIKES.TOGGLE,
        requestData
      );

      // 응답 데이터 반환
      // 백엔드 API에 따라 응답 구조가 다를 수 있음
      if (response.data) {
        return response.data;
      }

      // 데이터가 없는 경우 기본값 반환 (에러 방지)
      console.warn("좋아요 토글 응답에 데이터가 없습니다:", response);
      return {
        targetId,
        isLiked: false,
        likeCount: 0,
      };
    } catch (error) {
      console.error("좋아요 토글 중 오류 발생:", error);
      // 에러를 다시 throw하여 호출한 컴포넌트에서 처리할 수 있게 함
      throw error;
    }
  },

  /**
   * 좋아요 상태 확인
   *
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @returns 현재 좋아요 상태를 담은 Promise 객체
   *
   * @example
   * // 댓글 좋아요 상태 확인
   * const status = await LikeService.getLikeStatus(456, "POST_COMMENT");
   * console.log(`좋아요 상태: ${status.isLiked}, 개수: ${status.likeCount}`);
   */
  getLikeStatus: async (
    targetId: number,
    targetType: string
  ): Promise<LikeResponse> => {
    try {
      // 쿼리 파라미터 구성 (URL에 추가될 부분)
      const params = { targetId, targetType };

      // API 호출
      const response = await apiGet<LikeResponse>(API_PATHS.LIKES.STATUS, {
        params,
      });

      // 응답 데이터 반환
      if (response.data) {
        return response.data;
      }

      // 데이터가 없는 경우 기본값 반환
      console.warn("좋아요 상태 응답에 데이터가 없습니다:", response);
      return {
        targetId,
        isLiked: false,
        likeCount: 0,
      };
    } catch (error) {
      console.error("좋아요 상태 확인 중 오류 발생:", error);
      // 에러 발생 시도 기본값 반환 (사용자 경험 유지)
      return {
        targetId,
        isLiked: false,
        likeCount: 0,
      };
    }
  },

  /**
   * 여러 대상의 좋아요 상태를 한 번에 조회
   *
   * @param targets 조회할 대상 배열 [{targetId, targetType}, ...]
   * @returns 각 대상의 좋아요 상태를 담은 Promise 객체
   *
   * @example
   * // 여러 게시글의 좋아요 상태 확인
   * const targets = [
   *   { targetId: 1, targetType: "POST" },
   *   { targetId: 2, targetType: "POST" }
   * ];
   * const results = await LikeService.getBulkLikeStatus(targets);
   */
  getBulkLikeStatus: async (
    targets: { targetId: number; targetType: string }[]
  ): Promise<LikeResponse[]> => {
    try {
      // API 호출
      const response = await apiPost<LikeResponse[]>(
        `${API_PATHS.LIKES.STATUS}/bulk`,
        { targets }
      );

      // 응답 데이터 반환
      if (response.data) {
        return response.data;
      }

      // 데이터가 없는 경우 빈 배열 반환
      console.warn("대량 좋아요 상태 응답에 데이터가 없습니다:", response);
      return [];
    } catch (error) {
      console.error("대량 좋아요 상태 확인 중 오류 발생:", error);
      // 에러 발생 시 빈 배열 반환
      return [];
    }
  },
};

/**
 * 좋아요 상태 변경 후 콜백 함수의 타입 정의
 * LikeButton에서 상태 변경 시 호출할 함수 타입입니다.
 */
export type LikeChangeCallback = (state: {
  isLiked: boolean;
  likeCount: number;
}) => void;

/**
 * LikeButton 컴포넌트에서 사용할 API 함수
 * BoardAPI.toggleLike 대신 이 함수를 사용하도록 LikeButton을 수정합니다.
 *
 * @param targetId 좋아요 대상 ID
 * @param targetType 좋아요 대상 타입
 * @returns 서버 응답을 Promise로 반환
 */
export const toggleLikeAPI = async (
  targetId: number,
  targetType: string
): Promise<{ data: { isLiked: boolean; likeCount: number } }> => {
  try {
    // LikeService 사용
    const result = await LikeService.toggleLike(targetId, targetType);

    // LikeButton 컴포넌트의 기존 API 구조에 맞게 데이터 변환
    return {
      data: {
        isLiked: result.isLiked,
        likeCount: result.likeCount,
      },
    };
  } catch (error) {
    console.error(`${targetType} ${targetId} 좋아요 토글 실패:`, error);
    throw error;
  }
};
