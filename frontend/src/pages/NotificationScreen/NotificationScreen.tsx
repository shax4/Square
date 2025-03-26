"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Alert } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import NotificationCard, { type NotificationType } from "./Components/NotificationCard"

type Notification = {
  id: string
  title: string
  message: string
  notificationType: NotificationType
  isRead: boolean
}

// Mock data for notifications
const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "알림 제목",
    message: "알림내용입니다. 여기는 최대 두 줄이 나타나고 그 이후로는 ... 으로 됩니다...",
    notificationType: "post",
    isRead: false,
  },
  {
    id: "2",
    title: "알림 제목",
    message: "알림내용입니다. 여기는 최대 두 줄이 나타나고 그 이후로는 ... 으로 됩니다...",
    notificationType: "post",
    isRead: true,
  },
  {
    id: "3",
    title: "새로운 댓글 알림",
    message: '회원님의 게시글에 새로운 댓글이 달렸습니다. "정말 좋은 의견이네요! 저도 동의합니다."',
    notificationType: "comment",
    isRead: false,
  },
  {
    id: "4",
    title: "좋아요 알림",
    message: "회원님의 게시글에 좋아요가 추가되었습니다.",
    notificationType: "like",
    isRead: true,
  },
  {
    id: "5",
    title: "팔로우 알림",
    message: "새로운 사용자가 회원님을 팔로우하기 시작했습니다.",
    notificationType: "follow",
    isRead: false,
  },
  {
    id: "6",
    title: "시스템 알림",
    message: "서비스 이용약관이 업데이트되었습니다. 확인해주세요.",
    notificationType: "system",
    isRead: true,
  },
]

const NotificationScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  // Handle notification press (mark as read)
  const handleNotificationPress = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  // Handle delete notification
  const handleDeleteNotification = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id))
  }

  // Handle delete all notifications
  const handleDeleteAll = () => {
    if (notifications.length === 0) return

    Alert.alert(
      "모든 알림 삭제",
      "모든 알림을 삭제하시겠습니까?",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          onPress: () => setNotifications([]),
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationCard
                id={item.id}
                title={item.title}
                message={item.message}
                notificationType={item.notificationType}
                isRead={item.isRead}
                onPress={() => handleNotificationPress(item.id)}
                onDelete={() => handleDeleteNotification(item.id)}
              />
            )}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>알림이 없습니다.</Text>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "black",
  },
  deleteAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
  },
  deleteAllText: {
    fontSize: 12,
    color: "#555555",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
  },
})

export default NotificationScreen

