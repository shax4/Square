export interface Opinion {
    opinionId: number;
    content: string;
    likeCount: number;
    commentCount: number;
    isLeft: boolean;
    createdAt: string;
    nickname: string;
    profileUrl: string;
    userType: string; 
    isLiked: boolean;
}
