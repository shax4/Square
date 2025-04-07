import { create } from "zustand";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 상태 관리 스토어 인터페이스
 */
interface LikeState {
  /** 로딩 중인 아이템 ID 모음 */
  loadingIds: Record<number, boolean>;

  /** 에러 상태의 아이템 ID 모음 */
  errorIds: Record<number, boolean>;

  /**
   * 좋아요 토글 함수
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @param apiToggleFunction API 호출 함수
   * @returns API 응답
   */
  toggleLike: (
    targetId: number,
    targetType: TargetType,
    apiFunction: (targetId: number, targetType: TargetType) => Promise<any>
  ) => Promise<any>;

  /**
   * 현재 로딩 중인지 확인하는 함수
   * @param itemId 확인할 아이템 ID
   * @returns 로딩 중 여부
   */
  isLoading: (targetId: number) => boolean;

  /**
   * 현재 에러 상태인지 확인하는 함수
   * @param targetId 확인할 아이템 ID
   * @returns 에러 상태 여부
   */
  hasError: (targetId: number) => boolean;

  /**
   * 에러 상태를 초기화하는 함수
   * @param targetId 초기화할 아이템 ID
   */
  clearError: (targetId: number) => void;
}

// 중복 요청 방지를 위한 레퍼런스 변수 (store 외부에 선언)
const loadingItemsRef = new Set<number>();

export const useLikeStore = create<LikeState>()((set, get) => ({
  loadingIds: {},
  errorIds: {},

  toggleLike: async (targetId, targetType, apiFunction) => {
    if (get().loadingIds[targetId]) {
      console.log(`이미 ${targetId}에 대한 요청이 진행 중입니다.`);
      return null;
    }

    try {
      set((state) => ({
        loadingIds: { ...state.loadingIds, [targetId]: true },
        errorIds: { ...state.errorIds, [targetId]: false },
      }));

      console.log(`좋아요 토글 요청: ${targetType} ${targetId}`);
      const response = await apiFunction(targetId, targetType);

      set((state) => ({
        loadingIds: { ...state.loadingIds, [targetId]: false },
      }));

      console.log(`좋아요 토글 응답:`, response);
      return response;
    } catch (error) {
      console.error(`좋아요 토글 에러: ${targetType} ${targetId}`, error);

      set((state) => ({
        loadingIds: { ...state.loadingIds, [targetId]: false },
        errorIds: { ...state.errorIds, [targetId]: true },
      }));

      throw error;
    }
  },

  isLoading: (targetId) => !!get().loadingIds[targetId],

  hasError: (targetId) => !!get().errorIds[targetId],

  clearError: (targetId) => {
    set((state) => ({
      errorIds: { ...state.errorIds, [targetId]: false },
    }));
  },
}));
