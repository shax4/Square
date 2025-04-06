import { BoardAPI } from "../../pages/BoardScreen/Api/boardApi";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 버튼 사용을 위한 커스텀 훅
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
  onLikeChange?: (state: { isLiked: boolean; likeCount: number }) => void
) => {
  /**
   * 에러 처리 공통 함수
   * @param error 발생한 에러
   */
  const handleError = (error: any) => {
    console.error(`${targetType} ${targetId} 좋아요 처리 중 오류:`, error);
    // 공통 에러 로직 (필요에 따라 추가)
  };

  // LikeButton에 전달할 공통 props 반환
  return {
    targetId,
    targetType,
    initialLiked,
    initialCount,
    apiToggleFunction: BoardAPI.toggleLike,
    onLikeChange,
    onError: handleError,
    errorDisplayMode: "simple" as const, // 명시적 타입 지정
  };
};
