export interface Opinion {
    opinionId : number;
    topic : string;
    content : string;
    likeCount : number;
    isLiked: boolean;
}

export interface OpinionResponse {
    opinions: Opinion[];
    nextCursorId: number | null; // 다음 페이지가 없을 수도 있어서 null 허용
}