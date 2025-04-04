export type TargetType =
  | "POST"
  | "POST_COMMENT"
  | "PROPOSAL"
  | "OPINION_COMMENT"
  | "OPINION";

export interface LikeButtonProps {
  // UI 관련 props
  size?: "large" | "small";
  isVertical?: boolean;

  // 기능 관련 props
  targetId?: number;
  initialCount?: number;
  initialLiked?: boolean;
  targetType?: TargetType;
  apiToggleFunction?: (
    targetId: number,
    targetType: TargetType
  ) => Promise<any>;
  onLikeChange?: (newState: { isLiked: boolean; likeCount: number }) => void;
  onPress?: (isLiked: boolean) => void; // 기존 prop 유지 (하위 호환성)
  disabled?: boolean;
}
