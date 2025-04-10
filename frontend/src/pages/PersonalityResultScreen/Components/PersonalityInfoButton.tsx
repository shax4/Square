import type React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface PersonalityInfoButtonProps {
  onPress: () => void
}

const PersonalityInfoButton: React.FC<PersonalityInfoButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.questionMark}>?</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  questionMark: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666666",
  },
})

export default PersonalityInfoButton

