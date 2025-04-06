import { StyleSheet, View } from "react-native"
import colors from "../../../assets/colors"

type ProgressBarProps = {
  steps: number
  currentStep: number
}

const ProgressBar = ({ steps, currentStep }: ProgressBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${(currentStep / steps) * 100}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  track: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
  },
  progress: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
})

export default ProgressBar

