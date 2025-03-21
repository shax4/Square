export interface CardProps {
    debateId: number;
    category: string;
    topic: string;
    leftOption: string;
    rightOption: string;
    isScraped: boolean;
    hasVoted: boolean;
    leftCount: number;
    rightCount: number;
    leftPercent: number;
    rightPercent: number;
    totalVoteCount: number;
}
