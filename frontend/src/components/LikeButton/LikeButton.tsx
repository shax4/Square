import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./LikeButton.styles";
import { LikeButtonProps } from "./LikeButton.types";

const LikeButton = ({
  initialCount = 0,
  initialLiked = false,
  isVertical = true,
  size = "large",
  onPress,
  disabled = false,
}: LikeButtonProps) => {
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likeCount, setLikeCount] = useState<number>(initialCount);

  const handleLike = () => {
    console.log("LikeButton clicked, disabled:", disabled);
    // disabled 상태를 먼저 확인
    if (disabled) {
      console.log("Button is disabled, ignoring click");
      return;
    }

    // 외부 콜백이 있으면 외부 콜백에게 처리를 위임
    if (onPress) {
      console.log("Calling external onPress with liked:", liked);
      onPress(liked); // 현재 상태를 전달
      // 내부 상태는 외부에서 API 응답 후 업데이트하도록 여기서 변경하지 않음
    } else {
      // 외부 콜백이 없을 때만 내부 상태 변경
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    }
  };

  // 컴포넌트 프롭이 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount);
  }, [initialLiked, initialCount]);

  const iconSize = size === "large" ? 32 : 24;
  const textSize = size === "large" ? 14 : 12;

  return (
    <TouchableOpacity
      onPress={handleLike}
      style={[
        isVertical ? styles.container : styles.containerHorizontal,
        disabled && { opacity: 0.4 }, // 비활성화 시 시각적 피드백
      ]}
      activeOpacity={0.7}
      disabled={disabled}
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
