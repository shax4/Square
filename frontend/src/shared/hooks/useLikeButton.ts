import { toggleLikeAPI, LikeChangeCallback } from "../services/likeService";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 버튼 사용을 위한 커스텀 훅
 * 백엔드 API와 연결하여 좋아요 기능을 제공합니다.
 *
 * @example
 * // 기본 사용법
 * const likeProps = useLikeButton(post.id, "POST", post.isLiked, post.likeCount);
 * return <LikeButton {...likeProps} size="small" />;
 *
 * // 상태 변경 콜백 추가
 * const likeProps = useLikeButton(
 *   post.id,
 *   "POST",
 *   post.isLiked,
 *   post.likeCount,
 *   ({isLiked, likeCount}) => setPost({...post, isLiked, likeCount})
 * );
 *
 * @param targetId 좋아요 대상 ID
 * @param targetType 좋아요 대상 타입
 * @param initialLiked 초기 좋아요 상태
 * @param initialCount 초기 좋아요 개수
 * @param onLikeChange 좋아요 상태 변경 시 콜백
 * @returns LikeButton에 전달할 props
 */
export const useLikeButton = (
  targetId: number,
  targetType: TargetType,
  initialLiked: boolean,
  initialCount: number,
  onLikeChange?: LikeChangeCallback
) => {
  /**
   * 에러 처리 공통 함수
   * @param error 발생한 에러
   */
  const handleError = (error: any) => {
    console.error(`${targetType} ${targetId} 좋아요 처리 중 오류:`, error);

    // 사용자에게 표시할 에러 메시지 설정
    let errorMessage = "좋아요 처리 중 오류가 발생했습니다.";

    // 네트워크 오류인 경우
    if (error.message === "Network Error") {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    // 서버 오류인 경우
    if (error.response?.status >= 500) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    // 권한 오류인 경우
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = "로그인이 필요하거나 권한이 없습니다.";
    }

    // 필요에 따라 추가 로직 구현
    return errorMessage;
  };

  // LikeButton에 전달할 공통 props 반환
  return {
    targetId,
    targetType,
    initialLiked,
    initialCount,
    apiToggleFunction: toggleLikeAPI, // 새로 만든 API 함수 사용
    onLikeChange,
    onError: handleError,
    errorDisplayMode: "simple" as const, // 명시적 타입 지정
  };
};
