export type VotedViewProps = {
    debateId: number;
    leftOption: string;
    rightOption: string;
    leftPercent: number;
    rightPercent: number;
    leftCount: number;
    rightCount: number;
    isLeft: boolean;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};

export type UnvotedViewProps = {
    debateId: number;
    leftOption: string;
    rightOption: string;
    onSelectLeft: () => void;
    onSelectRight: () => void;
};
