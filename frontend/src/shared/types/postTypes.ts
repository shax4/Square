/**
 * 게시글 및 댓글 관련 타입 정의
 * 백엔드 API와 통신할 때 사용할 데이터 타입을 명확히 정의합니다.
 */

// 게시글 타입 정의
export interface Post {
  postId: number;
  nickname: string;
  profileUrl?: string;
  userType?: string;
  createdAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isScrapped?: boolean;
  images?: PostImage[];
}

// 인기 게시글(Popular) 타입 정의
export interface PopularPost {
  postId: number;
  title: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

// 게시글 이미지 타입 정의
export interface PostImage {
  imageUrl: string;
  s3Key: string;
}

// 게시글 목록 조회 응답 타입
export interface PostListResponse {
  userType: string | null;
  popular?: PopularPost[]; // 기존 필드명 (하위 호환성)
  popularPosts?: PopularPost[]; // 새 필드명 (API 응답과 일치)
  posts: Post[];
  nextCursorId?: number;
  nextCursorLikes?: number | null;
}

// 게시글 상세 조회 응답 타입
export interface PostDetailResponse extends Post {
  comments: Comment[];
}

// 댓글 타입 정의
export interface Comment {
  commentId: number;
  nickname: string;
  profileUrl?: string;
  userType?: string;
  createdAt: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  replyCount: number;
  replies?: Reply[];
}

// 대댓글 타입 정의
export interface Reply {
  replyId: number;
  parentId?: number;
  nickname: string;
  profileUrl?: string;
  userType?: string;
  createdAt: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
}

// 게시글 생성 요청 타입
export interface CreatePostRequest {
  title: string;
  content: string;
  postImage?: string[]; // s3Key 배열
}

// 게시글 수정 요청 타입
export interface UpdatePostRequest {
  title?: string;
  content?: string;
  postImage?: string[]; // s3Key 배열
}

// 댓글 생성 요청 타입
export interface CreateCommentRequest {
  postId: number;
  parentCommentId?: number; // 대댓글인 경우에만 필요
  content: string;
}

// 댓글 생성 응답 타입
export interface CreateCommentResponse {
  commentId: number;
  profileUrl?: string;
}

// 댓글 수정 요청 타입
export interface UpdateCommentRequest {
  content: string;
}

// 게시글 목록 조회 요청 파라미터 타입
export interface GetPostsParams {
  sort?: "latest" | "likes"; // 정렬 방식 (기본값: latest)
  nextCursorId?: number; // 다음 페이지 커서 ID (최신순)
  nextCursorLikes?: number; // 다음 페이지 커서 ID (좋아요순)
  limit?: number; // 페이지당 게시글 수
}

// 대댓글 목록 조회 요청 파라미터 타입
export interface GetRepliesParams {
  commentId: number; // 댓글 ID
  nextCursorId?: number; // 다음 페이지 커서 ID
  limit?: number; // 페이지당 대댓글 수
}

// 대댓글 목록 조회 응답 타입
export interface RepliesResponse {
  replies: Reply[];
  nextCursorId?: number;
}
