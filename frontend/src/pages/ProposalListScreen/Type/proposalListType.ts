export interface Proposal {
    proposalId: number;
    topic: string;
    likeCount: number;
    isLiked: boolean;
}

export interface ProposalResponse {
    proposals: Proposal[];
    nextCursorId: number | null;
    nextCursorLikes: number | null;
}