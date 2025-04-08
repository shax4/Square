import { StyleSheet, View, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import {ProfileImage, PersonalityTag} from "../../../components"
import Text from '../../../components/Common/Text';
import colors from "../../../../assets/colors";

type PostCardProps = {
  profileUrl: string
  nickname: string
  userType: string
  createdAt: string
  title: string
  content: string
  likeCount: number
  commentCount: number
  isLiked: boolean
  onLikePress?: () => void
  onCommentPress?: () => void
  onCardPress?: () => void
}

const PostCard = ({
  profileUrl,
  nickname,
  userType,
  createdAt,
  title,
  content,
  likeCount,
  commentCount,
  isLiked,
  onLikePress,
  onCommentPress,
  onCardPress,
}: PostCardProps) => {
  // Format the time difference
  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffInMs = now.getTime() - past.getTime()

    const seconds = Math.floor(diffInMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)
    const years = Math.floor(months / 12)

    if (years > 0) return `${years}년 전`
    if (months > 0) return `${months}달 전`
    if (days > 0) return `${days}일 전`
    if (hours > 0) return `${hours}시간 전`
    if (minutes > 0) return `${minutes}분 전`
    return "방금 전"
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onCardPress} activeOpacity={0.8}>
      {/* Header with profile info */}
      <View style={styles.header}>
        <ProfileImage imageUrl={profileUrl} variant="medium" />
        <View style={styles.userInfo}>
          <View style={styles.nameTagContainer}>
            <Text style={styles.nickname}>{nickname}</Text>
            <PersonalityTag personality={userType} nickname={nickname} />
          </View>
          <Text weight="medium" style={styles.timeAgo}>{getTimeAgo(createdAt)}</Text>
        </View>
      </View>

      {/* Post content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text weight="medium" style={styles.contentText} numberOfLines={1} ellipsizeMode="tail">
          {content}
        </Text>
      </View>

      {/* Footer with like and comment counts */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.interactionButton} onPress={onLikePress}>
          <Ionicons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "#FF3B30" : "#888888"} />
          <Text weight="medium" style={styles.interactionCount}>{likeCount.toLocaleString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionButton} onPress={onCommentPress}>
          <Ionicons name="chatbubble-outline" size={18} color="#888888" />
          <Text weight="medium" style={styles.interactionCount}>{commentCount}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "center",
  },
  nameTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  nickname: {
    fontSize: 15,
    fontWeight: "600",
    marginRight: 7,
  },
  timeAgo: {
    fontSize: 13,
    color: "#888888",
  },
  content: {
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 7,
    marginTop: 3
  },
  contentText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    marginTop: 8,
  },
  interactionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  interactionCount: {
    fontSize: 14,
    color: colors.grayText,
    marginLeft: 4,
  },
})

export default PostCard

