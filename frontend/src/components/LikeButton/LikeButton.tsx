import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./LikeButton.styles";
import { LikeButtonProps } from "./LikeButton.types";
import { useLikeStore } from "../../shared/stores/LikeStore";

const LikeButton = ({
  // UI 기본값
  size = "large",
  isVertical = true,

  // 기능 기본값
  itemId,
  initialCount = 0,
  initialLiked = false,
  apiToggleFunction,
  onLikeChange,
  onPress,
  disabled = false,
}: LikeButtonProps) => {
  // 상태 관리
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialCount);

  // Zustand 스토어 (조건부)
  const { toggleLike, isLoading } = useLikeStore();

  // API 모드인지 확인 (itemId와 apiToggleFunction이 모두 제공된 경우)
  const isApiMode = !!(itemId && apiToggleFunction);

  // disabled 상태 계산
  const isDisabled =
    disabled || (isApiMode && itemId ? isLoading(itemId) : false);

  // 핸들러 통합
  const handleLike = async () => {
    if (isDisabled) {
      console.log("Button is disabled, ignoring click");
      return;
    }

    if (isApiMode && itemId) {
      // API 모드 처리
      try {
        const response = await toggleLike(itemId, apiToggleFunction!, liked);

        if (response) {
          // 내부 상태 업데이트
          setLiked(response.data.isLiked);
          setLikeCount(response.data.likeCount);

          // 부모에게 변경 알림
          if (onLikeChange) {
            onLikeChange({
              isLiked: response.data.isLiked,
              likeCount: response.data.likeCount,
            });
          }
        }
      } catch (error) {
        console.error("좋아요 처리 중 오류:", error);
      }
    } else if (onPress) {
      // 외부 콜백 모드
      onPress(liked);
    } else {
      // 기본 모드 (내부 상태만 변경)
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    }
  };

  // props 변경 시 상태 업데이트
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  // UI 렌더링
  const iconSize = size === "large" ? 32 : 24;
  const textSize = size === "large" ? 14 : 12;

  return (
    <TouchableOpacity
      onPress={handleLike}
      style={[
        isVertical ? styles.container : styles.containerHorizontal,
        isDisabled && { opacity: 0.4 },
      ]}
      activeOpacity={0.7}
      disabled={isDisabled}
    >
      <Ionicons
        name={liked ? "heart" : "heart-outline"}
        size={iconSize}
        color={liked ? "red" : "gray"}
      />
      <Text style={[styles.likeCount, { fontSize: textSize }]}>
        {likeCount}
      </Text>
    </TouchableOpacity>
  );
};

export default LikeButton;
