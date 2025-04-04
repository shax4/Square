export interface LikeButtonProps {
  // UI 관련 props
  size?: "large" | "small";
  isVertical?: boolean;

  // 기능 관련 props
  itemId?: number; // API 호출 시 필요
  initialCount?: number;
  initialLiked?: boolean;
  apiToggleFunction?: (id: number) => Promise<any>;
  onLikeChange?: (newState: { isLiked: boolean; likeCount: number }) => void;
  onPress?: (isLiked: boolean) => void; // 기존 prop 유지 (하위 호환성)
  disabled?: boolean;
}
