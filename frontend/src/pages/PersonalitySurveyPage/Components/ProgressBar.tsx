import type React from "react"
import { View, Text, StyleSheet } from "react-native"

interface ProgressBarProps {
  current: number
  total: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  // Calculate progress percentage
  const progressPercentage = (current / total) * 100

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
      </View>

      <View style={styles.bubbleContainer}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleText}>
            {current} / {total}
          </Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  barContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3B82F6", // Blue color
    borderRadius: 4,
  },
  bubbleContainer: {
    alignItems: "flex-end",
    marginTop: 5,
  },
  bubble: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bubbleText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#4B5563",
  },
})

export default ProgressBar

