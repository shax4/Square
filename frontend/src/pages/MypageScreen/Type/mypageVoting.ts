export interface Voting {
    debateId : string;
    topic : string;
    isLeft : boolean;
    leftCount : number;
    rightCount : number;
    isScraped : boolean; 
    leftPercent : number; 
    rightPercent : number; 
}

export interface VotingResponse {
    debates: Voting[];
    nextCursorId: number | null; // 다음 페이지가 없을 수도 있어서 null 허용
}

export interface VotingScrapResponse {
    scraps: Voting[];
    nextCursorId: number | null; // 다음 페이지가 없을 수도 있어서 null 허용
}