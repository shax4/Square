export interface DebateProps {
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
