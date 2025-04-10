import type React from "react"
import { View } from "react-native"
import { GenderChartProps } from './GenderChart.types'
import { styles } from './GenderChart.styles'
import Text from '../../../../components/Common/Text';

const GenderChart: React.FC<GenderChartProps> = ({ data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)

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

  if (totalValue === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>투표자가 없습니다.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Labels above the chart */}
      <View style={styles.labelsContainer}>
        {data.map((item, index) => {
          if (item.value === 0) return null

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
          const percentage = (item.value / totalValue) * 100
          
          return (
            <View
              key={`section-${index}`}
              style={[
                styles.barSection,
                {
                  width: `${percentage}%`,
                  backgroundColor: getColorByLabel(item.label),
                },
              ]}
            >
              {item.value > 0 && (
                <Text style={styles.percentageText}>
                  {`${Math.round((item.value / totalValue) * 100)}%`}
                </Text>
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default GenderChart
