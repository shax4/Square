/**
 * 좋아요 관련 API 연결을 담당하는 서비스 레이어
 * LikeButton 컴포넌트에서 사용할 API 요청 함수들을 제공합니다.
 *
 * 백엔드 API는 응답 데이터 없이 성공/실패만 반환하므로
 * 클라이언트 측에서 AsyncStorage를 사용하여 좋아요 상태를 관리합니다.
 */

import { apiPost } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse, LikeRequest, LikeResponse } from "../types/apiTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
      // API 호출 - 백엔드는 성공/실패만 반환하며, 실제 좋아요 상태는 반환하지 않음
      return await apiPost<any>(API_PATHS.LIKES.TOGGLE, requestData);
    } catch (error) {
      console.error("좋아요 토글 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 좋아요 상태를 AsyncStorage에 저장하고 관리합니다.
   * 클라이언트 측 상태 관리 기능으로, 백엔드 응답에 의존하지 않습니다.
   *
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @returns 토글 후 상태를 담은 객체
   */
  manageLocalLikeState: async (
    targetId: number,
    targetType: TargetType
  ): Promise<{ isLiked: boolean; likeCount: number }> => {
    // 상태 저장 키 (형식: like_POST_123)
    const stateKey = `like_${targetType}_${targetId}`;

    // 현재 상태 가져오기
    let currentState = { isLiked: false, likeCount: 0 };
    try {
      const savedState = await AsyncStorage.getItem(stateKey);
      if (savedState) {
        currentState = JSON.parse(savedState);
      }
    } catch (e) {
      console.error("AsyncStorage에서 상태 로드 중 오류:", e);
    }

    // 새 상태 계산 (토글)
    const newIsLiked = !currentState.isLiked;
    const newLikeCount = newIsLiked
      ? currentState.likeCount + 1
      : Math.max(0, currentState.likeCount - 1);

    // 새 상태 저장
    const newState = { isLiked: newIsLiked, likeCount: newLikeCount };
    try {
      await AsyncStorage.setItem(stateKey, JSON.stringify(newState));
    } catch (e) {
      console.error("AsyncStorage에 상태 저장 중 오류:", e);
    }

    return newState;
  },

  /**
   * 좋아요 상태 확인 함수
   * AsyncStorage에 저장된 로컬 상태를 조회합니다.
   *
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @returns 현재 좋아요 상태 (LikeResponse 형식)
   */
  getLikeStatus: async (
    targetId: number,
    targetType: TargetType
  ): Promise<LikeResponse> => {
    // 상태 저장 키
    const stateKey = `like_${targetType}_${targetId}`;

    // 저장된 상태 확인
    try {
      const savedState = await AsyncStorage.getItem(stateKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        return {
          targetId,
          targetType,
          isLiked: state.isLiked,
          likeCount: state.likeCount,
        };
      }
    } catch (e) {
      console.error("AsyncStorage에서 상태 로드 중 오류:", e);
    }

    // 저장된 상태가 없으면 기본값 반환
    return {
      targetId,
      targetType,
      isLiked: false,
      likeCount: 0,
    };
  },

  /**
   * 여러 대상의 좋아요 상태를 한 번에 조회
   * 성능 최적화를 위해 배치 처리 방식으로 구현되었습니다.
   *
   * @param targets 조회할 대상 목록 (targetId, targetType)
   * @returns 각 대상의 좋아요 상태 배열 (LikeResponse[])
   */
  getBulkLikeStatus: async (
    targets: { targetId: number; targetType: TargetType }[]
  ): Promise<LikeResponse[]> => {
    const batchSize = 5; // 병렬 처리 수 제한 (AsyncStorage 부하 방지)
    const results: LikeResponse[] = [];

    // 객체 참조를 변수에 저장 (this 바인딩 문제 방지)
    const self = LikeService;

    // 배치 처리로 성능 최적화
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize);
      const promises = batch.map((target) =>
        self.getLikeStatus(target.targetId, target.targetType)
      );

      try {
        const batchResults = await Promise.all(promises);
        results.push(...batchResults);
      } catch (error) {
        console.error(`배치 ${i / batchSize + 1} 처리 중 오류:`, error);
      }
    }

    return results;
  },

  /**
   * 좋아요 상태 초기화 (디버깅/테스트용)
   * 특정 대상 또는 모든 좋아요 상태를 AsyncStorage에서 삭제합니다.
   *
   * @param targetId 특정 대상 ID (없으면 모든 대상)
   * @param targetType 특정 대상 타입 (없으면 모든 타입)
   */
  clearLikeStatus: async (
    targetId?: number,
    targetType?: TargetType
  ): Promise<void> => {
    try {
      if (targetId && targetType) {
        // 특정 대상만 초기화
        const stateKey = `like_${targetType}_${targetId}`;
        await AsyncStorage.removeItem(stateKey);
      } else {
        // 모든 좋아요 상태 초기화
        const allKeys = await AsyncStorage.getAllKeys();
        const likeKeys = allKeys.filter((key) => key.startsWith("like_"));

        if (likeKeys.length > 0) {
          await AsyncStorage.multiRemove(likeKeys);
        }
      }

      console.log("좋아요 상태 초기화 완료");
    } catch (error) {
      console.error("AsyncStorage에서 좋아요 상태 초기화 중 오류:", error);
      throw error;
    }
  },
};

/**
 * 좋아요 상태 변경 후 콜백 함수의 타입 정의
 * LikeButton의 onLikeChange prop 용도로 사용됩니다.
 */
export type LikeChangeCallback = (state: {
  isLiked: boolean;
  likeCount: number;
}) => void;

/**
 * LikeButton 컴포넌트가 사용하는 통합 API 함수
 * 서버 API 호출 및 로컬 상태 관리를 통합하여 일관된 인터페이스를 제공합니다.
 *
 * 작동 방식:
 * 1. 백엔드 API 호출 (응답 데이터 없음)
 * 2. AsyncStorage를 통한 로컬 상태 관리
 * 3. 클라이언트 측에서 계산된 상태 반환
 *
 * @param targetId 좋아요 대상 ID
 * @param targetType 좋아요 대상 타입
 * @returns LikeButton 컴포넌트가 기대하는 형식의 응답
 */
export const toggleLikeAPI = async (
  targetId: number,
  targetType: TargetType
): Promise<{ data: { isLiked: boolean; likeCount: number } }> => {
  try {
    // 1. 백엔드 API 호출 (성공 여부만 확인)
    await LikeService.callToggleLikeApi(targetId, targetType);

    // 2. 로컬 상태 관리 (AsyncStorage)
    const newState = await LikeService.manageLocalLikeState(
      targetId,
      targetType
    );

    console.log(`좋아요 토글 (${targetType} ${targetId}): `, newState);

    // 3. LikeButton 컴포넌트가 기대하는 형식으로 반환
    return {
      data: newState,
    };
  } catch (error) {
    console.error(`${targetType} ${targetId} 좋아요 토글 실패:`, error);
    throw error;
  }
};
