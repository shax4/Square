import { TouchableOpacity, Text, ViewStyle, TextStyle } from "react-native";
import { ButtonProps, ButtonVariant } from "./Button.types";
import { styles } from "./Button.styles";

const Button = ({
  label,
  disabled = false,
  onPress,
  variant = ButtonVariant.Primary,
}: ButtonProps) => {
  /**
   * variant나 disabled 여부에 따라 container 스타일을 동적으로 구성
   */
  const getContainerStyle = (): ViewStyle[] => {
    const containerStyles: ViewStyle[] = [styles.container];

    // 비활성화 버튼 컨테이너
    if (disabled) {
      if (variant === ButtonVariant.DeleteId) {
        // 회원 탈퇴 비활성화 버튼
        containerStyles.push(styles.containerDisabledDeleteId);
      } else {
        containerStyles.push(styles.containerDisabled);
      }
    } else if (variant === ButtonVariant.Check) {
      // 중복 확인 버튼
      containerStyles.push(styles.containerCheck);
    } else if (variant === ButtonVariant.Warning) {
      // 신고 버튼
      containerStyles.push(styles.containerWarning);
      // 회원 탈퇴 활성화 버튼
    } else if (variant === ButtonVariant.DeleteId) {
      containerStyles.push(styles.containerDeleteId);
    }
    // 다른 variant가 있다면 여기에 추가
    return containerStyles;
  };
  const getLabelStyle = (): TextStyle[] => {
    const labelStyles: TextStyle[] = [styles.label];

    // 비활성화 상태 라벨
    if (disabled) {
      if (variant === ButtonVariant.DeleteId) {
        // 회원 탈퇴 비활성화 라벨(일반 라벨과 동일)
        labelStyles.push(styles.label);
      } else {
        labelStyles.push(styles.labelDisabled);
      }
    }
    // variant별 텍스트 색상 등을 다르게 하고 싶다면 여기에 추가
    return labelStyles;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={getLabelStyle()}>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
