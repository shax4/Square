import { create } from "zustand";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 상태 관리 스토어 인터페이스
 */
interface LikeState {
  /** 로딩 중인 아이템 ID 모음 */
  loadingItems: Set<number>;

  /** 에러 상태의 아이템 ID 모음 */
  errorItems: Set<number>;

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
    apiToggleFunction: (
      targetId: number,
      targetType: TargetType
    ) => Promise<any>
  ) => Promise<any>;

  /**
   * 현재 로딩 중인지 확인하는 함수
   * @param itemId 확인할 아이템 ID
   * @returns 로딩 중 여부
   */
  isLoading: (itemId: number) => boolean;

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
  loadingItems: new Set<number>(),
  errorItems: new Set<number>(),

  toggleLike: async (
    targetId: number,
    targetType: TargetType,
    apiToggleFunction: (
      targetId: number,
      targetType: TargetType
    ) => Promise<any>
  ) => {
    // 중복 요청 방지
    if (loadingItemsRef.has(targetId)) {
      console.log(`이미 처리 중인 요청: ${targetId}`);
      return;
    }

    // 로딩 상태 설정
    loadingItemsRef.add(targetId);
    set((state) => {
      const newSet = new Set(state.loadingItems);
      newSet.add(targetId);
      return { loadingItems: newSet };
    });

    try {
      // API 호출
      const response = await apiToggleFunction(targetId, targetType);

      // 오류 상태 초기화
      set((state) => {
        const newErrors = new Set(state.errorItems);
        newErrors.delete(targetId);
        return { errorItems: newErrors };
      });

      return response;
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);

      // 오류 상태 설정
      set((state) => {
        const newErrors = new Set(state.errorItems);
        newErrors.add(targetId);
        return { errorItems: newErrors };
      });

      throw error;
    } finally {
      // 로딩 상태 초기화
      loadingItemsRef.delete(targetId);
      set((state) => {
        const newSet = new Set(state.loadingItems);
        newSet.delete(targetId);
        return { loadingItems: newSet };
      });
    }
  },

  isLoading: (targetId) => {
    return get().loadingItems.has(targetId) || loadingItemsRef.has(targetId);
  },

  // 에러 상태 확인 함수
  hasError: (targetId) => {
    return get().errorItems.has(targetId);
  },

  // 에러 상태 초기화 함수
  clearError: (targetId) => {
    set((state) => {
      const newErrors = new Set(state.errorItems);
      newErrors.delete(targetId);
      return { errorItems: newErrors };
    });
  },
}));
