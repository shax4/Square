export interface LikeButtonProps{
    initialCount?: number;
    initialLiked?: boolean;
    isVertical?: boolean;
    size?: "large" | "small";
    onPress?: (isLiked: boolean) => void;
}