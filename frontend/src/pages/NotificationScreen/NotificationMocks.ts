import {Notification} from "./Components/NotificationCard.types"

// Mock data for notifications
export const initialNotifications: Notification[] = [
  {
    notificationId: "1",
    title: "오늘의 논쟁이 시작됐어요!",
    message: "공유 킥보드, 도심에 계속 둬도 될까?",
    notificationType: "system",
    isRead: false,
  },
  {
    notificationId: "2",
    title: "내 게시물에 댓글이 달렸어요",
    message: "ㅇㅈ",
    notificationType: "post",
    isRead: false,
  },
  {
    notificationId: "3",
    title: "내 댓글에 답글이 달렸어요",
    message: "정말 좋은 의견이네요! 저도 동의합니다.",
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