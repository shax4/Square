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

export const updateVoteState = (debate: Debate): Debate => {
    const newDebate = { ...debate };

    return computeDebateFields(newDebate);
};

// 각 Debate 누락 필드 계산
export const computeDebateFields = (debate: Debate): Debate => {
    const totalVoteCount = debate.leftCount + debate.rightCount;
    const leftPercent = totalVoteCount > 0 ? Math.round((debate.leftCount / totalVoteCount) * 100) : 0;
    const rightPercent = totalVoteCount > 0 ? 100 - leftPercent : 0;

    return {
        ...debate,
        totalVoteCount,
        leftPercent,
        rightPercent,
    };
};