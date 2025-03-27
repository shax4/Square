// 의견 요청
import { OpinionComment } from "./OpinionCommentProps";

export interface OpinionDetailResponse {
    opinionId: number;
    nickname: string;
    profileUrl: string;
    userType: string;
    createdAt: string;
    content: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    comments: OpinionComment[];
}