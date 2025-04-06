import { useState, useEffect, useCallback, memo } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
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
      } catch (error: any) {
        console.error("좋아요 처리 중 오류:", error);

        // 에러 유형에 따른 메시지 설정
        if (error.response) {
          // HTTP 에러 응답이 있는 경우
          switch (error.response.status) {
            case 401:
              setErrorMessage("로그인 필요");
              break;
            case 403:
              setErrorMessage("권한 없음");
              break;
            case 429:
              setErrorMessage("잠시 후 재시도");
              break;
            default:
              setErrorMessage(`오류 ${error.response.status}`);
          }

          // 상세 모드인 경우 Alert으로 추가 정보 표시
          if (errorDisplayMode === "detailed") {
            Alert.alert(
              "좋아요 오류",
              error.response.data?.message ||
                `오류가 발생했습니다 (${error.response.status})`,
              [{ text: "확인", style: "cancel" }]
            );
          }
        } else if (error.request) {
          // 요청은 보냈지만 응답이 없는 경우 (네트워크 문제)
          setErrorMessage("네트워크 오류");

          if (errorDisplayMode === "detailed") {
            Alert.alert(
              "네트워크 오류",
              "서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요.",
              [{ text: "확인", style: "cancel" }]
            );
          }
        } else {
          // 요청 설정 중 에러
          setErrorMessage("요청 오류");

          if (errorDisplayMode === "detailed") {
            Alert.alert(
              "요청 오류",
              "요청을 처리하는 중 오류가 발생했습니다.",
              [{ text: "확인", style: "cancel" }]
            );
          }
        }

        // 부모에게 에러 알림 (선택적)
        if (onError) {
          onError(error);
        }
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
    onError,
    errorDisplayMode,
  ]);

  // 에러 상태 클릭 핸들러 (useCallback으로 래핑)
  const handleErrorClick = useCallback(() => {
    if (isErrored && targetId) {
      // 에러 상태 초기화
      clearError(targetId);
      setErrorMessage(null);

      // 즉시 재시도하지 않고 버튼을 준비 상태로만 변경
      // 사용자가 직접 다시 클릭하도록 함
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
      setErrorMessage(null);
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
        {isErrored ? errorMessage || "재시도" : likeCount}
      </Text>
    </TouchableOpacity>
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
