import { Proposal } from "./ProposalProps";

export interface ProposalResponse {
    proposals: Proposal[];
    nextCursorId: number;
    nextCursorLikes: number | null;
}