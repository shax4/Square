import { useState, useEffect, useCallback } from "react";
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
  targetId,
  initialCount = 0,
  initialLiked = false,
  apiToggleFunction,
  onLikeChange,
  onPress,
  disabled = false,
  targetType,
}: LikeButtonProps) => {
  // 상태 관리
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialCount);

  // Zustand 스토어 (조건부)
  const { toggleLike, isLoading, hasError, clearError } = useLikeStore();

  // API 모드인지 확인 (targetId와 apiToggleFunction이 모두 제공된 경우)
  const isApiMode = !!(targetId && apiToggleFunction);

  // disabled 상태 계산
  const isDisabled =
    disabled || (isApiMode && targetId ? isLoading(targetId) : false);

  // 에러 상태 계산 추가
  const isErrored = isApiMode && targetId ? hasError(targetId) : false;

  // 핸들러 통합 (useCallback으로 래핑하여 불필요한 재생성 방지)
  const handleLike = useCallback(async () => {
    if (isDisabled) {
      console.log("Button is disabled, ignoring click");
      return;
    }

    if (isApiMode && targetId && targetType) {
      // API 모드 처리
      try {
        const response = await toggleLike(
          targetId,
          targetType,
          apiToggleFunction!
        );

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
  }, [
    isDisabled,
    isApiMode,
    targetId,
    targetType,
    toggleLike,
    apiToggleFunction,
    liked,
    onLikeChange,
    onPress,
  ]);

  // 에러 상태 클릭 핸들러 (useCallback으로 래핑)
  const handleErrorClick = useCallback(() => {
    if (isErrored && targetId) {
      clearError(targetId);
    }
  }, [isErrored, targetId, clearError]);

  // initialLiked와 initialCount가 변경될 때만 해당 상태 업데이트
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  // targetId나 targetType이 변경될 때 에러 상태 초기화
  useEffect(() => {
    if (isApiMode && targetId) {
      clearError(targetId);
    }
  }, [targetId, targetType, isApiMode, clearError]);

  // UI 렌더링
  const iconSize = size === "large" ? 32 : 24;
  const textSize = size === "large" ? 14 : 12;

  return (
    <TouchableOpacity
      onPress={isErrored ? handleErrorClick : handleLike}
      style={[
        isVertical ? styles.container : styles.containerHorizontal,
        isDisabled && { opacity: 0.4 },
        isErrored && styles.errorContainer,
      ]}
      activeOpacity={0.7}
      disabled={isDisabled && !isErrored}
    >
      <Ionicons
        name={isErrored ? "alert-circle" : liked ? "heart" : "heart-outline"}
        size={iconSize}
        color={isErrored ? "red" : liked ? "red" : "gray"}
      />
      <Text
        style={[
          styles.likeCount,
          { fontSize: textSize },
          isErrored && styles.errorText,
        ]}
      >
        {isErrored ? "재시도" : likeCount}
      </Text>
    </TouchableOpacity>
  );
};

export default LikeButton;
