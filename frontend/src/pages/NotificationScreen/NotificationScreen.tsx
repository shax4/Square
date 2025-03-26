import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Alert } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import NotificationCard from "./Components/NotificationCard"
import {initialNotifications} from "./NotificationMocks"
import {Notification} from "./Components/NotificationCard.types"

const NotificationScreen = ({ navigation }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  // Handle notification press (mark as read)
  const handleNotificationPress = (id: string) => {
    console.log("알림 누름 ID : ", id);
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.notificationId === id ? { ...notification, isRead: true } : notification,
      ),
    )
  }

  // Handle delete notification
  const handleDeleteNotification = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.notificationId !== id))
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
            keyExtractor={(item) => item.notificationId}
            renderItem={({ item }) => (
              <NotificationCard
                id={item.notificationId}
                title={item.title}
                message={item.message}
                notificationType={item.notificationType}
                isRead={item.isRead}
                onPress={() => handleNotificationPress(item.notificationId)}
                onDelete={() => handleDeleteNotification(item.notificationId)}
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

