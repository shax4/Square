export interface Comment {
    commentId: number;
    title : string;
    content : string;
    likeCount: number;
    isLiked : boolean;
}

export interface CommentResponse {
    comments: Comment[];
    nextCursorId: number | null; // 다음 페이지가 없을 수도 있어서 null 허용
}