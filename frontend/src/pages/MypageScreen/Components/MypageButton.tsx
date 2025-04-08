import { StyleSheet, TouchableOpacity, type ViewStyle, type TextStyle } from "react-native"
import Text from '../../../components/Common/Text';

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary"
  style?: ViewStyle
  textStyle?: TextStyle
}

const MypageButton = ({ title, onPress, variant = "primary", style, textStyle }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === "secondary" && styles.secondaryButton, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, variant === "secondary" && styles.secondaryButtonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#0066FF",
  },
  buttonText: {
    color: "#0066FF",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#0066FF",
  },
})

export default MypageButton

