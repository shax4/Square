/**
 * 좋아요 관련 API 연결을 담당하는 서비스 레이어
 * LikeButton 컴포넌트에서 사용할 API 요청 함수들을 제공합니다.
 */

import { apiGet, apiPost } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse, LikeRequest, LikeResponse } from "../types/apiTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      // GET 요청이 없으므로 초기 상태를 가정하여 기본값 반환
      // 실제 상태는 사용자가 좋아요를 누를 때 업데이트됨
      return {
        targetId,
        targetType,
        isLiked: false,
        likeCount: 0,
      };
    } catch (error) {
      console.error("좋아요 상태 확인 중 오류 발생:", error);
      // 에러 발생 시도 기본값 반환 (사용자 경험 유지)
      return {
        targetId,
        targetType,
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
      // 병렬로 여러 개의 개별 요청 보내기
      const promises = targets.map((target) =>
        LikeService.getLikeStatus(target.targetId, target.targetType)
      );

      // 모든 요청 완료 대기
      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error("좋아요 상태 확인 중 오류 발생:", error);
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
 * 좋아요 토글 API 함수
 * 백엔드 응답에 데이터가 없으므로 클라이언트에서 토글 결과를 추론
 */
export const toggleLikeAPI = async (
  targetId: number,
  targetType: string
): Promise<{ data: { isLiked: boolean; likeCount: number } }> => {
  try {
    // 요청 데이터 구성
    const requestData: LikeRequest = {
      targetId,
      targetType,
    };

    // API 호출 (응답 본문 없음)
    await apiPost<void>(API_PATHS.LIKES.TOGGLE, requestData);

    // 클라이언트 상태 관리를 위한 키 생성
    const stateKey = `like_${targetType}_${targetId}`;

    // 상태 가져오기
    let currentState = { isLiked: false, likeCount: 0 };
    try {
      const savedState = await AsyncStorage.getItem(stateKey);
      if (savedState) {
        currentState = JSON.parse(savedState);
      }
    } catch (e) {
      console.error("상태 로드 오류:", e);
    }

    // 새 상태 계산 (토글)
    const newIsLiked = !currentState.isLiked;
    const newLikeCount = newIsLiked
      ? currentState.likeCount + 1
      : Math.max(0, currentState.likeCount - 1);

    // 새 상태 저장
    const newState = { isLiked: newIsLiked, likeCount: newLikeCount };
    await AsyncStorage.setItem(stateKey, JSON.stringify(newState));

    console.log(`좋아요 토글 (${targetType} ${targetId}): `, newState);

    // 새 상태 반환 (LikeButton 컴포넌트가 기대하는 형식)
    return {
      data: newState,
    };
  } catch (error) {
    console.error(`${targetType} ${targetId} 좋아요 토글 실패:`, error);
    throw error;
  }
};
