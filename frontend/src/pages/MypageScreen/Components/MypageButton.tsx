import { StyleSheet, Text, TouchableOpacity, type ViewStyle, type TextStyle } from "react-native"

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
    backgroundColor: "#4040B0",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#4040B0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#4040B0",
  },
})

export default MypageButton

