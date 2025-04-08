import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Text from '../../../components/Common/Text';

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
        <View style={styles.topicContainer}>
          <Text style={styles.topic} numberOfLines={1} ellipsizeMode="tail">
            {topic}
          </Text>
        </View>

        <View style={styles.contentBox}>
          <Text weight="medium" style={styles.prefix}>ㄴ</Text>
          <Text weight="medium" style={styles.content} numberOfLines={2} ellipsizeMode="tail">
            {content}
          </Text>
        </View>
      </View>

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
        <Text weight="medium" style={styles.likeCount}>{likeCount.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
    marginLeft: 4,
  },
  topicContainer: {
    marginTop: 2,
    marginBottom: 6,
    marginRight: 20,
  },
  topic: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  contentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 20,
  },
  prefix: {
    fontSize: 14,
    color: '#999999',
    marginRight: 6,
    fontWeight: '500',
  },
  content: {
    fontSize: 14,
    color: '#555555',
    flex: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  likeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 7
  },
  likeButton: {
    marginBottom: 4,
  },
  likeCount: {
    fontSize: 14,
    color: '#888888',
    marginRight: 5
  },
})

export default OpinionCard

