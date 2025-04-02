export interface Debate {
    debateId: number;
    category: string;
    topic: string;
    leftOption: string;
    rightOption: string;
    isScraped: boolean;
    isLeft: boolean | null;
    leftCount: number;
    rightCount: number;
    leftPercent: number;
    rightPercent: number;
    totalVoteCount: number;
}

// REST 통신으로 받아온 Debate 리스트의 필드 계산
export const computeDebateListFields = (debates: Debate[]): Debate[] => {
    return debates.map(computeDebateFields);
};


// 각 Debate 누락 필드 계산
export const computeDebateFields = (debate: Debate): Debate => {
    debate.totalVoteCount = debate.leftCount + debate.rightCount;

    debate.leftPercent = debate.leftPercent > 0 ? Math.round((debate.leftCount / debate.totalVoteCount) * 100) : 0;
    debate.rightPercent = debate.leftPercent > 0 ? 100 - debate.leftPercent : 0;

    return debate;
};
