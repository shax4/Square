import { axiosInstance } from "../../../shared";
import { ProposalResponse } from "../Type/ProposalTypes";

export const postProposal = async (topic : string) : Promise<ProposalResponse> => {
    try{
        const response = await axiosInstance.post('/api/proposals', {topic});

        return response.data;
    }catch(error){
        console.error("주제 청원 실패 : ", error);
        throw error;
    }
}