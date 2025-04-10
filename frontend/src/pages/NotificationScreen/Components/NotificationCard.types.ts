export type NotificationType = "post" | "comment" | "like" | "follow" | "system"

export type Notification = {
    notificationId: string
    title: string
    message: string
    notificationType: NotificationType
    isRead: boolean
}

export type NotificationCardProps = {
  id: string
  title: string
  message: string
  notificationType: NotificationType
  isRead: boolean
  onPress: () => void
  onDelete: () => void
}