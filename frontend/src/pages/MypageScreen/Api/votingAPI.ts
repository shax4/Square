import { axiosInstance } from "../../../shared";
import { VotingResponse } from "../Type/mypageVoting";

export const getMypageVotings = async (apiType:string, nextCursorId : number | null, limit : number) : Promise<VotingResponse> => {
    try{
        const response = await axiosInstance.get(`/api/debates/${apiType}`, {
            params: { nextCursorId, limit }
        })

        return response.data;
    }catch(error){
        console.log(`마이페이지 - ${apiType} 투표 불러오기 실패 : `, error);
        throw error;
    }
}