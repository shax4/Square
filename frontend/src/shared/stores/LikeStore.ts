import { create } from "zustand";

interface LikeState {
  // 로딩 중인 아이템 ID 저장
  loadingItems: Set<number>;

  // 좋아요 토글 함수
  toggleLike: (
    itemId: number,
    apiToggleFunction: (id: number) => Promise<any>,
    currentLiked?: boolean
  ) => Promise<any>;

  // 로딩 상태 확인 함수
  isLoading: (itemId: number) => boolean;
}

// 중복 요청 방지를 위한 레퍼런스 변수 (store 외부에 선언)
const loadingItemsRef = new Set<number>();

export const useLikeStore = create<LikeState>()((set, get) => ({
  loadingItems: new Set<number>(),

  toggleLike: async (
    itemId: number,
    apiToggleFunction: (id: number) => Promise<any>,
    currentLiked?: boolean
  ) => {
    // 중복 요청 방지
    if (loadingItemsRef.has(itemId)) {
      console.log(`이미 처리 중인 요청: ${itemId}`);
      return;
    }

    // 로딩 상태 설정
    loadingItemsRef.add(itemId);
    set((state) => {
      const newSet = new Set(state.loadingItems);
      newSet.add(itemId);
      return { loadingItems: newSet };
    });

    try {
      // API 호출
      const response = await apiToggleFunction(itemId);
      return response;
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      throw error;
    } finally {
      // 로딩 상태 초기화
      loadingItemsRef.delete(itemId);
      set((state) => {
        const newSet = new Set(state.loadingItems);
        newSet.delete(itemId);
        return { loadingItems: newSet };
      });
    }
  },

  isLoading: (itemId) => {
    return get().loadingItems.has(itemId) || loadingItemsRef.has(itemId);
  },
}));
