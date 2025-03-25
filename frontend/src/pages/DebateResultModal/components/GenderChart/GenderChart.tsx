import type React from "react"
import { View, Text} from "react-native"
import {GenderChartProps} from './GenderChart.types'
import {styles} from './GenderChart.styles'

const GenderChart: React.FC<GenderChartProps> = ({ data }) => {
  // Calculate total value for percentage calculation
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

  // Get color based on label
  const getColorByLabel = (label: string): string => {
    switch (label) {
      case "남성":
        return "#00AEFF"
      case "여성":
        return "#F553DA"
      case "기타":
        return "#6541F2"
      default:
        return "#CCCCCC"
    }
  }

  return (
    <View style={styles.container}>
      {/* Labels above the chart */}
      <View style={styles.labelsContainer}>
        {data.map((item, index) => {
          // Calculate the position for each label based on the percentage
          const previousValues = data.slice(0, index).reduce((sum, prevItem) => sum + prevItem.value, 0)
          const startPercentage = (previousValues / totalValue) * 100
          const widthPercentage = (item.value / totalValue) * 100

          return (
            <View
              key={`label-${index}`}
              style={[
                styles.labelItem,
                {
                  left: `${startPercentage + (widthPercentage / 2) - 10}%`,
                },
              ]}
            >
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
          )
        })}
      </View>

      {/* Horizontal bar chart */}
      <View style={styles.barContainer}>
        {data.map((item, index) => {
          const widthPercentage = (item.value / totalValue) * 100
          return (
            <View
              key={`section-${index}`}
              style={[
                styles.barSection,
                {
                  width: `${widthPercentage}%`,
                  backgroundColor: getColorByLabel(item.label),
                },
              ]}
            >
              <Text style={styles.percentageText}>{`${item.value}%`}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default GenderChart

