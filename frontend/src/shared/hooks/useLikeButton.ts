import { toggleLikeAPI, LikeChangeCallback } from "../services/likeService";
import { TargetType } from "../../components/LikeButton/LikeButton.types";

/**
 * 좋아요 버튼 사용을 위한 커스텀 훅
 * 백엔드 API와 연결하여 좋아요 기능을 제공합니다.
 *
 * 이 훅은 좋아요 기능의 표준 사용 패턴을 제공하여 코드 일관성과 재사용성을 높입니다.
 * BackendAPI + AsyncStorage + UI 상태 관리를 통합하여 처리합니다.
 *
 * @example
 * // 기본 사용법 (게시글 목록에서)
 * const likeProps = useLikeButton(post.id, "POST", post.isLiked, post.likeCount);
 * return <LikeButton {...likeProps} size="small" isVertical={false} />;
 *
 * // 상태 변경 콜백 추가 (상세 화면에서)
 * const likeProps = useLikeButton(
 *   post.id,
 *   "POST",
 *   post.isLiked,
 *   post.likeCount,
 *   ({isLiked, likeCount}) => setPost({...post, isLiked, likeCount})
 * );
 * return <LikeButton {...likeProps} size="large" isVertical={true} />;
 *
 * @param targetId 좋아요 대상 ID (게시글, 댓글 등)
 * @param targetType 좋아요 대상 타입 (POST, POST_COMMENT 등)
 * @param initialLiked 초기 좋아요 상태 (서버에서 받은 데이터)
 * @param initialCount 초기 좋아요 개수 (서버에서 받은 데이터)
 * @param onLikeChange 좋아요 상태 변경 시 부모 컴포넌트에 알리는 콜백
 * @returns LikeButton에 전달할 props 객체
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
   * 다양한 에러 상황에 맞는 사용자 친화적인 메시지를 반환합니다.
   *
   * @param error 발생한 에러 객체
   * @returns 사용자에게 표시할 오류 메시지
   */
  const handleError = (error: any) => {
    console.error(`${targetType} ${targetId} 좋아요 처리 중 오류:`, error);

    // 사용자에게 표시할 에러 메시지 설정
    let errorMessage = "좋아요 처리 중 오류가 발생했습니다.";

    // 네트워크 오류인 경우 (인터넷 연결 문제)
    if (error.message === "Network Error") {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    // 서버 오류인 경우 (백엔드 문제)
    if (error.response?.status >= 500) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    // 권한 오류인 경우 (로그인 필요 등)
    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage = "로그인이 필요하거나 권한이 없습니다.";
    }

    // AsyncStorage 관련 오류
    if (error.message?.includes("AsyncStorage")) {
      errorMessage =
        "데이터 저장 중 오류가 발생했습니다. 앱을 다시 실행해보세요.";
    }

    return errorMessage;
  };

  // LikeButton에 전달할 공통 props 반환
  return {
    targetId,
    targetType,
    initialLiked,
    initialCount,
    apiToggleFunction: toggleLikeAPI, // LikeService의 통합 API 함수 사용
    onLikeChange,
    onError: handleError,
    errorDisplayMode: "simple" as const, // 명시적 타입 지정
  };
};
