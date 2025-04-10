import {Notification} from "./Components/NotificationCard.types"

// Mock data for notifications
export const initialNotifications: Notification[] = [
  {
    notificationId: "1",
    title: "알림 제목",
    message: "알림내용입니다. 여기는 최대 두 줄이 나타나고 그 이후로는 ... 으로 됩니다...",
    notificationType: "post",
    isRead: false,
  },
  {
    notificationId: "2",
    title: "알림 제목",
    message: "알림내용입니다. 여기는 최대 두 줄이 나타나고 그 이후로는 ... 으로 됩니다...",
    notificationType: "post",
    isRead: false,
  },
  {
    notificationId: "3",
    title: "새로운 댓글 알림",
    message: '회원님의 게시글에 새로운 댓글이 달렸습니다. "정말 좋은 의견이네요! 저도 동의합니다."',
    notificationType: "comment",
    isRead: false,
  },
  {
    notificationId: "4",
    title: "좋아요 알림",
    message: "회원님의 게시글에 좋아요가 추가되었습니다.",
    notificationType: "like",
    isRead: false,
  },
  {
    notificationId: "5",
    title: "시스템 알림",
    message: "서비스 이용약관이 업데이트되었습니다. 확인해주세요.",
    notificationType: "system",
    isRead: false,
  },
]