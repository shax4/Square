// 의견 요청
import { Comment } from "./Comment.types";

export interface OpinionsResponse {
    opinionId: number;
    nickname: string;
    profileUrl: string;
    userType: string;
    createdAt: string;
    content: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    comments: Comment[];
}