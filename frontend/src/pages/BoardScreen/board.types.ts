// 댓글 타입 정의
export interface Comment {
  commentId: number; // 댓글 고유 ID
  nickname: string; // 작성자 닉네임
  profileUrl?: string; // 작성자 프로필 이미지 URL
  userType: string; // 작성자 성향 타입
  createdAt: string; // 작성 시각
  content: string; // 댓글 내용
  likeCount: number; // 좋아요 수
  isLiked: boolean; // 현재 사용자의 좋아요 여부
  replyCount: number; // 대댓글 수
  replies?: Reply[]; // 대댓글 목록 (있을 경우)
  isMe?: boolean; // 현재 사용자 작성 여부 (백엔드에서 제공 시)
  updatedAt?: string; // 수정 시각 (백엔드에서 제공 시)
}

// 대댓글 타입 정의 - API 응답 스키마와 정확히 일치
export interface Reply {
  replyId: number; // 대댓글 고유 ID (스키마에 따라 replyId 사용)
  parentId: number; // 부모 댓글 ID
  nickname: string; // 작성자 닉네임
  profileUrl?: string; // 작성자 프로필 이미지 URL
  userType: string; // 작성자 성향 타입
  createdAt: string; // 작성 시각
  content: string; // 대댓글 내용
  likeCount: number; // 좋아요 수
  isLiked: boolean; // 현재 사용자의 좋아요 여부
}

// 게시글 타입 정의
export interface Post {
  postId: number; // 게시글 ID
  profileUrl?: string; // 작성자 프로필 이미지 URL
  userType: string; // 작성자 성향 타입
  nickname: string; // 작성자 닉네임
  createdAt: string; // 작성 시각
  title: string; // 게시글 제목
  content: string; // 게시글 내용
  likeCount: number; // 좋아요 수
  commentCount: number; // 댓글 수
  isLiked: boolean; // 현재 사용자의 좋아요 여부
  isScrapped: boolean; // 현재 사용자의 스크랩 여부
  comments: Comment[]; // 댓글 목록
}

// 좋아요 타입
export interface LikeResponse {
  isLiked: boolean;
  likeCount: number;
}
