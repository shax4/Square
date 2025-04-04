import { create } from "zustand";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

interface LikeState {
  // 로딩 중인 아이템 ID 저장
  loadingItems: Set<number>;

  // 에러 상태 추가
  errorItems: Set<number>;

  // 좋아요 토글 함수
  toggleLike: (
    targetId: number,
    targetType: TargetType,
    apiToggleFunction: (
      targetId: number,
      targetType: TargetType
    ) => Promise<any>
  ) => Promise<any>;

  // 로딩 상태 확인 함수
  isLoading: (itemId: number) => boolean;

  // 에러 상태 확인 함수 추가
  hasError: (targetId: number) => boolean;
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
