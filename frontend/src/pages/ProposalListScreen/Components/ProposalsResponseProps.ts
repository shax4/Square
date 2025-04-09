import { Proposal } from "../Type/proposalListType";

export interface ProposalResponse {
    proposals: Proposal[];
    nextCursorId: number;
    nextCursorLikes: number | null;
}