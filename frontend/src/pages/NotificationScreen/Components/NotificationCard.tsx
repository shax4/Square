import { StyleSheet, Text, View, TouchableOpacity, Animated } from "react-native"
import { Swipeable } from "react-native-gesture-handler"
import { Ionicons } from "@expo/vector-icons"
import {NotificationCardProps} from "./NotificationCard.types"

const NotificationCard = ({
  id,
  title,
  message,
  notificationType,
  isRead,
  onPress,
  onDelete,
}: NotificationCardProps) => {
  // Render right actions (delete)
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    })

    return (
      <Animated.View
        style={[
          styles.deleteAction,
          {
            transform: [{ translateX: trans }],
          },
        ]}
      >
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // Get notification type label and color
  const getNotificationTypeInfo = () => {
    switch (notificationType) {
      case "post":
        return { label: "게시글", color: "#A0C4FF" }
      case "comment":
        return { label: "댓글", color: "#9BF6FF" }
      case "like":
        return { label: "좋아요", color: "#FFADAD" }
      case "system":
        return { label: "시스템", color: "#FFADAD" }
      default:
        return { label: "게시글", color: "#A0C4FF" }
    }
  }

  const typeInfo = getNotificationTypeInfo()

  return (
    <Swipeable renderRightActions={renderRightActions} rightThreshold={40} overshootRight={false}>
      <TouchableOpacity
        style={[styles.container, isRead && styles.readContainer]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message} numberOfLines={2} ellipsizeMode="tail">
            {message}
          </Text>
        </View>

        <View style={[styles.typeButton, { backgroundColor: typeInfo.color }]}>
          <Text style={styles.typeButtonText}>{typeInfo.label}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    backgroundColor: "white",
    alignItems: "center",
  },
  readContainer: {
    backgroundColor: "#F5F5F5",
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "black",
  },
  message: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    justifyContent: "center",
  },
  typeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
  },
  deleteAction: {
    backgroundColor: "#FF4D4D",
    justifyContent: "center",
    alignItems: "flex-end",
    width: 100,
    height: "100%",
  },
  deleteButton: {
    width: 100,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
})

export default NotificationCard