import { create } from "zustand";
import { TargetType } from "../../components/LikeButton/LikeButton.types";
import { LikeService } from "../services/likeService"; // 실제 API 호출 함수 import

// 좋아요 상태 객체 타입 정의
interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
}

// 좋아요 대상 식별 키 생성 함수
const getLikeKey = (targetId: number, targetType: TargetType): string =>
  `${targetType}_${targetId}`;

// 제거: 선언만 하고 실제 구현은 likeService.ts에서 가져오는 부분 삭제 (setEmitLikeEvent 포함)

/**
 * 좋아요 상태 관리 스토어 인터페이스
 */
export interface LikeState {
  /** 로딩 중인 아이템 키 모음 (`${targetType}_${targetId}`) */
  loadingKeys: Set<string>;

  /** 에러 상태의 아이템 키 모음 */
  errorKeys: Set<string>;

  /** 좋아요 상태 저장소 */
  likeStatuses: Record<string, LikeStatus>;

  /** 좋아요 상태 변경 감지용 트리거 (Mypage 업데이트용) */
  likeUpdateTrigger: number;

  /**
   * 좋아요 토글 함수 (Optimistic Update 적용)
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @param initialLiked 현재 좋아요 상태 (토글 전)
   * @param initialCount 현재 좋아요 개수 (토글 전)
   */
  toggleLike: (
    targetId: number,
    targetType: TargetType,
    initialLiked: boolean, // Optimistic Update를 위해 현재 상태 필요
    initialCount: number // Optimistic Update를 위해 현재 상태 필요
  ) => Promise<void>; // 반환값 제거 (상태는 스토어 구독으로 확인)

  /**
   * 현재 로딩 중인지 확인하는 함수
   * @param targetId 확인할 아이템 ID
   * @param targetType 확인할 아이템 타입
   * @returns 로딩 중 여부
   */
  isLoading: (targetId: number, targetType: TargetType) => boolean;

  /**
   * 현재 에러 상태인지 확인하는 함수
   * @param targetId 확인할 아이템 ID
   * @param targetType 확인할 아이템 타입
   * @returns 에러 상태 여부
   */
  hasError: (targetId: number, targetType: TargetType) => boolean;

  /**
   * 에러 상태를 초기화하는 함수
   * @param targetId 초기화할 아이템 ID
   * @param targetType 초기화할 아이템 타입
   */
  clearError: (targetId: number, targetType: TargetType) => void;

  /**
   * 좋아요 상태 가져오기 (스토어 내부 상태 직접 접근)
   * @param targetId 좋아요 대상 ID
   * @param targetType 좋아요 대상 타입
   * @returns 좋아요 상태 객체 (없으면 null)
   */
  getLikeStatus: (
    targetId: number,
    targetType: TargetType
  ) => LikeStatus | null;

  /**
   * 여러 대상의 좋아요 상태를 초기화하거나 업데이트
   * (페이지 로드 시 초기 데이터 설정용)
   * @param updates 키-값 형태의 좋아요 상태 객체들
   */
  initializeLikes: (updates: Record<string, LikeStatus>) => void;

  /** 좋아요 상태 변경 트리거 업데이트 함수 */
  triggerLikeUpdate: () => void;
}

// 제거: 중복 요청 방지 레퍼런스 및 타임아웃 관련 변수 삭제

export const useLikeStore = create<LikeState>()((set, get) => ({
  loadingKeys: new Set<string>(),
  errorKeys: new Set<string>(),
  likeStatuses: {},
  likeUpdateTrigger: 0,

  toggleLike: async (targetId, targetType, initialLiked, initialCount) => {
    const key = getLikeKey(targetId, targetType);

    // 이미 로딩 중이면 중복 요청 방지
    if (get().loadingKeys.has(key)) {
      console.log(`[Store] ${key} 좋아요 요청이 이미 진행 중입니다.`);
      return;
    }

    // 이전 상태 저장 (롤백 대비)
    const previousStatus = get().likeStatuses[key] || {
      isLiked: initialLiked,
      likeCount: initialCount,
    };

    // Optimistic Update 계산
    const optimisticStatus: LikeStatus = {
      isLiked: !previousStatus.isLiked,
      likeCount: previousStatus.isLiked
        ? Math.max(0, previousStatus.likeCount - 1) // 0 미만 방지
        : previousStatus.likeCount + 1,
    };

    // 로딩 시작 및 Optimistic Update 적용
    set((state) => {
      const newLoadingKeys = new Set(state.loadingKeys).add(key);
      const newErrorKeys = new Set(state.errorKeys);
      newErrorKeys.delete(key); // 에러 상태 초기화 (Set에서 키 제거)
      return {
        loadingKeys: newLoadingKeys,
        errorKeys: newErrorKeys, // 수정된 Set 할당
        likeStatuses: { ...state.likeStatuses, [key]: optimisticStatus },
      };
    });

    console.log(`[Store] ${key} Optimistic Update:`, optimisticStatus);

    try {
      // 실제 API 호출 (likeService 사용)
      const response = await LikeService.callToggleLikeApi(
        targetId,
        targetType
      );

      // === 디버깅 로그 ===
      console.log(`[Store] ${key} API 응답 수신:`, JSON.stringify(response));
      // 수정: isResponseMissing 조건을 null 또는 undefined 체크로 변경
      const isResponseMissing = response === null || response === undefined;
      const isSuccessExplicitlyFalse = response?.success === false;
      console.log(
        `[Store] ${key} 응답 조건 확인: isResponseMissing=${isResponseMissing}, isSuccessExplicitlyFalse=${isSuccessExplicitlyFalse}`
      );
      // === 디버깅 로그 끝 ===

      // API 호출 성공 여부 확인 (수정된 조건 사용)
      // response가 null/undefined 이거나, response.success가 명시적으로 false인 경우 실패로 처리
      if (isResponseMissing || isSuccessExplicitlyFalse) {
        console.error(`[Store] ${key} API 응답 실패 처리 진입:`, response);
        throw new Error(response?.message || "API 호출에 실패했습니다.");
      }

      // API 성공 시: 상태 유지 (이미 Optimistic Update 됨)
      console.log(`[Store] ${key} API 호출 성공. 상태 유지.`);

      // **** 중요: 상태 변경 트리거 호출 ****
      get().triggerLikeUpdate();

      // 로딩 상태만 해제
      set((state) => {
        const newLoadingKeys = new Set(state.loadingKeys);
        newLoadingKeys.delete(key);
        return { loadingKeys: newLoadingKeys };
      });
    } catch (error) {
      console.error(`[Store] ${key} 좋아요 토글 실패 및 롤백:`, error);

      // API 실패 시: 이전 상태로 롤백 및 에러 상태 설정
      set((state) => {
        const newLoadingKeys = new Set(state.loadingKeys);
        newLoadingKeys.delete(key);
        const newErrorKeys = new Set(state.errorKeys).add(key);
        return {
          loadingKeys: newLoadingKeys,
          errorKeys: newErrorKeys,
          likeStatuses: { ...state.likeStatuses, [key]: previousStatus }, // 이전 상태로 복구
        };
      });
    }
  },

  isLoading: (targetId, targetType) => {
    const key = getLikeKey(targetId, targetType);
    return get().loadingKeys.has(key);
  },

  hasError: (targetId, targetType) => {
    const key = getLikeKey(targetId, targetType);
    return get().errorKeys.has(key);
  },

  clearError: (targetId, targetType) => {
    const key = getLikeKey(targetId, targetType);
    set((state) => {
      const newErrorKeys = new Set(state.errorKeys);
      newErrorKeys.delete(key);
      return { errorKeys: newErrorKeys };
    });
  },

  // 좋아요 상태 가져오기 (수정 없음)
  getLikeStatus: (targetId, targetType) => {
    const key = getLikeKey(targetId, targetType);
    return get().likeStatuses[key] || null;
  },

  // 여러 좋아요 상태 초기화/업데이트 함수 (수정)
  initializeLikes: (updates) => {
    console.log("[Store] 좋아요 상태 초기화/업데이트 시도:", updates);
    set((state) => {
      const newStatuses = { ...state.likeStatuses };
      let changed = false;
      for (const key in updates) {
        // 해당 아이템이 현재 로딩 중이면 덮어쓰지 않음 (토글 진행 중 보호)
        if (state.loadingKeys.has(key)) {
          console.log(`[Store] ${key} 는 로딩 중이므로 초기화 건너뜀.`);
          continue; // 다음 키로 넘어감
        }

        // 상태가 다르거나 새로 추가될 때만 업데이트
        if (
          !newStatuses[key] ||
          newStatuses[key].isLiked !== updates[key].isLiked ||
          newStatuses[key].likeCount !== updates[key].likeCount
        ) {
          newStatuses[key] = updates[key];
          changed = true;
          console.log(`[Store] ${key} 상태 업데이트 적용:`, updates[key]);
        }
      }
      // 변경된 경우에만 새 상태 객체 반환 (Zustand 최적화)
      return changed ? { likeStatuses: newStatuses } : {};
    });
  },

  // 제거: setLikeStatus 함수 (initializeLikes 로 대체)

  // <<< 트리거 업데이트 액션 구현 추가 >>>
  triggerLikeUpdate: () =>
    set((state) => ({ likeUpdateTrigger: state.likeUpdateTrigger + 1 })),
}));
