// 의견 댓글 
export interface OpinionComment {
    commentId: number;
    nickname: string;
    profileUrl: string;
    userType: string;
    createdAt: string;
    likeCount: number;
    content: string;
    isLiked: boolean;
}