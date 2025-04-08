import { useState, useEffect, useCallback, memo } from "react";
import { View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./LikeButton.styles";
import { LikeButtonProps } from "./LikeButton.types";
import { useLikeStore } from "../../shared/stores/LikeStore";
import { toggleLikeAPI } from "../../shared/services/likeService";
import Text from '../../components/Common/Text';

const LikeButton = ({
  // UI 기본값
  size = "large",
  isVertical = true,

  // 기능 기본값
  targetId,
  initialCount = 0,
  initialLiked = false,
  apiToggleFunction = toggleLikeAPI,
  onLikeChange,
  onPress,
  onError,
  errorDisplayMode = "simple",
  disabled = false,
  targetType,
}: LikeButtonProps) => {
  // 상태 관리
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialCount);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // API 모드인지 확인 (targetId와 apiToggleFunction이 모두 제공된 경우)
  const isApiMode = !!(targetId && apiToggleFunction);

  // Zustand 스토어 (최적화된 방식으로 상태 접근)
  const toggleLike = useLikeStore((state) => state.toggleLike);
  const isLoading = useLikeStore((state) =>
    isApiMode && targetId ? state.isLoading(targetId) : false
  );
  const hasError = useLikeStore((state) =>
    isApiMode && targetId ? state.hasError(targetId) : false
  );
  const clearError = useLikeStore((state) => state.clearError);

  // disabled 상태 계산
  const isDisabled = disabled || isLoading;

  // 에러 상태 계산
  const isErrored = hasError;

  // 핸들러 통합 (useCallback으로 래핑하여 불필요한 재생성 방지)
  const handleLike = useCallback(async () => {
    if (isDisabled) {
      console.log("Button is disabled, ignoring click");
      return;
    }

    // 이전 에러 메시지 초기화
    setErrorMessage(null);

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
        console.error(
          `좋아요 처리 중 오류 발생: ${targetType} ${targetId}`,
          error
        );

        // onError 함수가 문자열을 반환할 경우 errorMsg를 업데이트, 문자열이 아니면 기본 메시지 사용
        let errorMsg = "좋아요 처리 중 오류가 발생했습니다.";
        if (onError) {
          try {
            const result = onError(error);
            if (result) {
              errorMsg = result;
            }
          } catch (e) {
            console.error("Error in onError callback:", e);
          }
        }
        setErrorMessage(errorMsg);

        // 디버깅을 위한 추가 정보 로그
        console.debug("API 요청 정보:", { targetId, targetType });
        if (error && typeof error === "object" && "response" in error) {
          console.debug("서버 응답:", (error as any).response?.data);
        }
      }
    } else {
      // 로컬 모드 처리 (서버 없이 UI만 업데이트)
      const newLiked = !liked;
      const newCount = newLiked ? likeCount + 1 : likeCount - 1;

      setLiked(newLiked);
      setLikeCount(Math.max(0, newCount)); // 음수 방지

      if (onLikeChange) {
        onLikeChange({ isLiked: newLiked, likeCount: Math.max(0, newCount) });
      }

      if (onPress) {
        onPress(newLiked);
      }
    }
  }, [
    isDisabled,
    isApiMode,
    targetId,
    targetType,
    toggleLike,
    apiToggleFunction,
    liked,
    likeCount,
    onLikeChange,
    onPress,
    onError,
  ]);

  // 초기값이 변경되면 내부 상태 업데이트
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  // 아이콘 크기 계산
  const iconSize = size === "large" ? 24 : 18;

  // 좋아요 아이콘 (채워진/빈)
  const LikeIcon = liked ? (
    <Ionicons name="heart" size={iconSize} color="#FF4757" />
  ) : (
    <Ionicons name="heart-outline" size={iconSize} color="#888888" />
  );

  // 에러 렌더링
  const renderError = () => {
    if (!errorMessage) return null;

    if (errorDisplayMode === "detailed") {
      // 상세 에러 표시 (주로 상세 화면에서 사용)
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      );
    } else {
      // 간단한 에러 표시 (주로 목록에서 사용)
      return (
        <TouchableOpacity
          style={styles.simpleErrorIcon}
          onPress={() => Alert.alert("알림", errorMessage)}
        >
          <Ionicons name="alert-circle" size={16} color="#FF4757" />
        </TouchableOpacity>
      );
    }
  };

  // 수직/수평 레이아웃 스타일 선택
  const containerStyle = isVertical
    ? styles.verticalContainer
    : styles.horizontalContainer;

  return (
    <View style={[containerStyle, isErrored && styles.errorContainer]}>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLike}
        disabled={isDisabled}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <Ionicons name="sync" size={iconSize} color="#555" />
        ) : (
          LikeIcon
        )}
      </TouchableOpacity>

      <View style={styles.countContainer}>
        <Text weight="medium" style={styles.countText}>{likeCount}</Text>
        {errorMessage && renderError()}
      </View>
    </View>
  );
};

/**
 * Props 비교 함수 - 중요 props만 비교하여 불필요한 리렌더링 방지
 * @param prevProps 이전 props
 * @param nextProps 새 props
 * @returns 동일하면 true, 다르면 false
 */
const arePropsEqual = (
  prevProps: LikeButtonProps,
  nextProps: LikeButtonProps
): boolean => {
  // 핵심 props만 비교 (함수형 props 제외)
  return (
    prevProps.targetId === nextProps.targetId &&
    prevProps.targetType === nextProps.targetType &&
    prevProps.initialLiked === nextProps.initialLiked &&
    prevProps.initialCount === nextProps.initialCount &&
    prevProps.disabled === nextProps.disabled &&
    prevProps.size === nextProps.size &&
    prevProps.isVertical === nextProps.isVertical &&
    prevProps.errorDisplayMode === nextProps.errorDisplayMode
    // 주의: 함수형 props(onLikeChange, onPress, onError, apiToggleFunction)는
    // 참조 동일성만 비교하면 매번 다르게 인식될 수 있으므로 비교에서 제외
  );
};

// memo로 컴포넌트 래핑하여 내보내기
export default memo(LikeButton, arePropsEqual);
