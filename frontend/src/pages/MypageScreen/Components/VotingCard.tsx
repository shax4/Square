import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import colors from "../../../../assets/colors"

type VotingCardProps = {
  topic: string
  isLeft: boolean
  leftCount: number
  rightCount: number
  leftPercent: number
  rightPercent: number
  isScraped: boolean
  leftOptionText?: string
  rightOptionText?: string
  onScrapToggle?: () => void
  onCardPress?: () => void
}

const VotingCard = ({
  topic,
  isLeft,
  leftCount,
  rightCount,
  leftPercent,
  rightPercent,
  isScraped,
  leftOptionText = "찬성",
  rightOptionText = "반대",
  onScrapToggle,
  onCardPress,
}: VotingCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.topic} numberOfLines={2} ellipsizeMode="tail">
          {topic}
        </Text>
        <TouchableOpacity
          style={styles.scrapButton}
          onPress={onScrapToggle}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name={isScraped ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isScraped ? colors.warnRed : colors.black}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        <View style={[styles.option, styles.leftOption, isLeft && styles.selectedLeftOption]}>
          <View style={styles.optionIconContainer}>
            <Text style={styles.emoji}>🙆🏻‍♂️</Text>
          </View>
          <Text style={styles.percentText}>{leftPercent}%</Text>
          <Text style={styles.countText}>{leftCount}명</Text>
        </View>

        <View style={[styles.option, styles.rightOption, !isLeft && styles.selectedRightOption]}>
          <View style={styles.optionIconContainer}>
            <Text style={styles.emoji}>🙅🏻</Text>
          </View>
          <Text style={styles.percentText}>{rightPercent}%</Text>
          <Text style={styles.countText}>{rightCount}명</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  topic: {
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
    color: colors.black,
  },
  scrapButton: {
    padding: 4,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 60,
  },
  option: {
    flex: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  leftOption: {
    backgroundColor: colors.yesLight,
    marginRight: 4,
  },
  rightOption: {
    backgroundColor: colors.noLight,
    marginLeft: 4,
  },
  selectedLeftOption: {
    backgroundColor: colors.yesDark,
  },
  selectedRightOption: {
    backgroundColor: colors.noDark,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  emoji: {
    fontSize: 24,
  },
  percentText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.black,
    marginRight: 4,
  },
  countText: {
    fontSize: 14,
    color: colors.black,
  },
})

export default VotingCard

