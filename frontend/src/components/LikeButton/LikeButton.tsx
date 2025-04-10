import { useState, useEffect, useCallback, memo } from "react";
import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { shallow } from "zustand/shallow";
import { styles } from "./LikeButton.styles";
import { LikeButtonProps } from "./LikeButton.types";
import { useLikeStore, LikeState } from "../../shared/stores/LikeStore";
import Text from "../../components/Common/Text";

const LikeButton = ({
  // UI props
  size = "large",
  isVertical = true,

  // Data props
  targetId,
  targetType,
  initialCount = 0,
  initialLiked = false,

  // 기타 props
  onError,
  errorDisplayMode = "simple",
  disabled = false,
}: LikeButtonProps) => {
  // targetId 또는 targetType이 없으면 버튼 렌더링 안 함 (먼저 체크)
  if (targetId === undefined || targetType === undefined) {
    console.warn("LikeButton: targetId 또는 targetType이 누락되었습니다.");
    return null;
  }

  // Zustand 스토어에서 필요한 상태 및 액션을 개별적으로 선택
  const key = `${targetType}_${targetId}`;

  // Select isLiked and likeCount individually, providing initial values as fallback
  const isLiked = useLikeStore(
    (state) => state.likeStatuses[key]?.isLiked ?? initialLiked
  );
  const likeCount = useLikeStore(
    (state) => state.likeStatuses[key]?.likeCount ?? initialCount
  );

  const isLoadingState = useLikeStore((state: LikeState) =>
    state.isLoading(targetId, targetType)
  );
  const isErrorState = useLikeStore((state: LikeState) =>
    state.hasError(targetId, targetType)
  );
  const toggleLike = useLikeStore((state: LikeState) => state.toggleLike);
  const clearError = useLikeStore((state: LikeState) => state.clearError);

  // 최종 비활성화 상태 계산
  const isDisabled = disabled || isLoadingState;

  // 에러 메시지 상태
  const errorMessage = isErrorState ? "좋아요 처리에 실패했습니다." : null;

  // 버튼 클릭 핸들러 (useCallback 의존성 배열 확인)
  const handlePress = useCallback(() => {
    if (isDisabled) return;

    if (isErrorState) {
      clearError(targetId, targetType);
    }

    // 스토어의 toggleLike 액션 호출 (현재 상태 전달)
    toggleLike(targetId, targetType, isLiked, likeCount);
  }, [
    isDisabled,
    isErrorState,
    targetId,
    targetType,
    isLiked,
    likeCount,
    toggleLike,
    clearError,
  ]); // isLiked, likeCount 직접 사용

  // 아이콘 크기 계산
  const iconSize = size === "large" ? 24 : 18;

  // 좋아요 아이콘
  const LikeIcon = isLiked ? (
    <Ionicons name="heart" size={iconSize} color="#FF4757" />
  ) : (
    <Ionicons name="heart-outline" size={iconSize} color="#888888" />
  );

  // 에러 UI 렌더링
  const renderError = () => {
    if (!errorMessage) return null;

    if (onError) {
      onError(new Error(errorMessage));
    }

    if (errorDisplayMode === "detailed") {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.simpleErrorIcon}
          onPress={() => Alert.alert("오류", errorMessage)}
        >
          <Ionicons name="alert-circle" size={16} color="#FF4757" />
        </TouchableOpacity>
      );
    }
  };

  // 수직/수평 레이아웃 스타일
  const containerStyle = isVertical
    ? styles.verticalContainer
    : styles.horizontalContainer;

  return (
    <View style={[containerStyle, isErrorState && styles.errorContainer]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {isLoadingState ? (
          <ActivityIndicator size={iconSize} color="#555" />
        ) : (
          LikeIcon
        )}
      </TouchableOpacity>

      <View style={styles.countContainer}>
        <Text weight="medium" style={styles.countText}>
          {/* 스토어에서 가져온 likeCount 사용 */}
          {likeCount}
        </Text>
        {isErrorState && renderError()}
      </View>
    </View>
  );
};

// memo로 컴포넌트 래핑 (Props 변경 시 리렌더링 방지 목적 유지)
export default memo(LikeButton);
