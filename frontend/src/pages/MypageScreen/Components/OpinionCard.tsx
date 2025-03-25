import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type OpinionCardProps = {
  topic: string
  content: string
  likeCount: number
  isLiked: boolean
  onLikeToggle?: (isLiked: boolean) => void
  onCardPress?: () => void
}

const OpinionCard = ({ topic, content, likeCount, isLiked, onLikeToggle, onCardPress }: OpinionCardProps) => {
  const handleLikePress = () => {
    if (onLikeToggle) {
      onLikeToggle(!isLiked)
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress} activeOpacity={0.8}>
      <View style={styles.contentContainer}>
        <Text style={styles.topic} numberOfLines={1} ellipsizeMode="tail">
          {topic}
        </Text>

        <Text style={styles.content} numberOfLines={2} ellipsizeMode="tail">
          {content}
        </Text>

        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={handleLikePress}
            style={styles.likeButton}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#FF0000" : "#888888"}
            />
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likeCount.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  topic: {
    fontSize: 16,
    fontWeight: "700",
    color: 'black',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: 'black',
    lineHeight: 20,
    marginBottom: 12,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeButton: {
    marginRight: 4,
  },
  likeCount: {
    fontSize: 14,
    color: "#888888",
  },
})

export default OpinionCard

