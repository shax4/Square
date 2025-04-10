import { axiosInstance } from "../../../shared";
import { ProposalResponse } from "../Type/ProposalTypes";

export const postProposal = async (topic: string): Promise<ProposalResponse> => {
    try {
        const response = await axiosInstance.post('/api/proposals', { topic });

        return response.data;
    } catch (error) {
        console.error("주제 청원 실패 : ", error);
        throw error;
    }
}

interface DebateCreateForm {
    proposalId: number;
    topic: string;
    leftOption: string;
    rightOption: string;
    categoryName: string;
}

export const createDebate = async (newDebate: DebateCreateForm) => {
    try {
        const response = await axiosInstance.post('/api/debates/today', newDebate);

        return response.data;
    } catch (error) {
        console.error("논쟁 등록 실패 : ", error);
        throw error;
    }
}