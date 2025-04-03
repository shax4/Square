import { axiosInstance } from "../../../shared";
import { ProposalResponse } from "../Type/proposalListType";

export const getAllProposals = async (sort : string | null, nextCursorId : number | null, nextCursorLikes: number | null, limit : number | null) : Promise<ProposalResponse> => {
    try{
        const response = await axiosInstance.get('/api/proposals', {
            params: { sort, nextCursorId, nextCursorLikes, limit }
        });

        return response.data;
    }catch(error){
        console.error(`주제 신청 리스트 불러오기 실패 :`, error);
        throw error;
    }
}