import React from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"

interface OptionCircleProps {
  isSelected: boolean
  isEdge: boolean
  onPress: () => void
}

const OptionCircle: React.FC<OptionCircleProps> = React.memo(({ isSelected, isEdge, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionWrapper} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.circle, isEdge && styles.largerCircle, isSelected && styles.selectedCircle]}>
        
        {isSelected && <Feather name="check" size={isEdge ? 32 : 26} color="white" />}
        {!isSelected && <View style={styles.innerDot} />}
      </View>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  optionWrapper: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  largerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  selectedCircle: {
    backgroundColor: "black",
    borderColor: "black",
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#aaa",
    position: "absolute",
  },
})

export default OptionCircle

