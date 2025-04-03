export interface Post {
    postId: number;
    nickname: string;
    profileUrl: string;
    userType: string;
    createdAt: string;
    title: string;
    content: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
}

export interface PostResponse {
    posts: Post[];
    nextCursorId: number | null; // 다음 페이지가 없을 수도 있어서 null 허용
  }