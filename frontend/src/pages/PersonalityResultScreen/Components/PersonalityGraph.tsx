import type React from "react"
import { View, StyleSheet } from "react-native"
import Text from '../../../components/Common/Text';

interface PersonalityGraphProps {
  title: string
  leftLabel: string
  rightLabel: string
  value: number // -3 to -1 or 1 to 3
  color: string
}

const PersonalityGraph: React.FC<PersonalityGraphProps> = ({ title, leftLabel, rightLabel, value, color }) => {
  // Ensure value is within valid range
  const validValue = Math.max(Math.min(Math.abs(value), 3), 1) * Math.sign(value)
  const isPositive = validValue > 0
  const absValue = Math.abs(validValue)

  // Calculate width percentage based on value (each step is ~16.67% of half width)
  const widthPercentage = (absValue / 3) * 100

  return (
    <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
      <View style={styles.graphContainer}>
        <View style={styles.labelsContainer}>
          <Text style={styles.label}>{leftLabel}</Text>

          <Text style={styles.label}>{rightLabel}</Text>
        </View>

        <View style={styles.barContainer}>
          <View style={styles.leftSection}>
            {!isPositive && (
              <View
                style={[
                  styles.valueBar,
                  {
                    width: `${widthPercentage}%`,
                    backgroundColor: color,
                    alignSelf: "flex-end",
                  },
                ]}
              >
                <Text style={styles.valueText}>{absValue}</Text>
              </View>
            )}
          </View>

          <View style={styles.rightSection}>
            {isPositive && (
              <View
                style={[
                  styles.valueBar,
                  {
                    width: `${widthPercentage}%`,
                    backgroundColor: color,
                  },
                ]}
              >
                <Text style={styles.valueText}>{absValue}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: "100%",
  },
  title: {
    fontSize: 18,
    color: "#37383C",
    marginBottom: 0,
    textAlign: "center",
  },
  graphContainer: {
    width: "100%",
  },
  labelsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    color: "#7E7E7E",
  },
  barContainer: {
    flexDirection: "row",
    height: 45,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  leftSection: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  rightSection: {
    width: "50%",
  },
  valueBar: {
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  scaleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "8%",
    marginTop: 4,
  },
  scaleText: {
    fontSize: 10,
    color: "#999999",
  },
})

export default PersonalityGraph

