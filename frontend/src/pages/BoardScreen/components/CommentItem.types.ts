// 댓글 타입 정의
export interface Comment {
  commentId: number; // 댓글/대댓글 공통 고유 ID
  parentId?: number; // 최상위 댓글은 이 값이 null 이거나 없음
  nickname: string; // 작성자 닉네임
  profileUrl?: string; // 작성자 프로필 URL (Optional)
  userType: string; // 작성자 성향 타입
  createdAt: string; // 작성 시각
  content: string; // 댓글 내용
  likeCount: number; // 좋아요 수
  isLiked: boolean; // 현재 사용자의 좋아요 여부
  replyCount: number; // 대댓글 수 (최상위 댓글에만 의미 있을 수 있음)
  replies?: Reply[];  // 초기 대댓글 목록
}

// 대댓글 타입
export interface Reply extends Omit<Comment, "replyCount" | "replies"> {
  parentId: number; // 대댓글은 parentId가 필수
}
