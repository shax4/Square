import { axiosInstance } from "../../../shared";
import { VotingResponse, VotingScrapResponse } from "../Type/mypageVoting";

export const getMypageVotings = async (nextCursorId : number | null, limit : number) : Promise<VotingResponse> => {
    try{
        
        const response = await axiosInstance.get(`/api/debates/my-votes`, {
            params: { nextCursorId, limit }
        })

        return response.data;
    }catch(error){
        console.log(`마이페이지 - 투표 불러오기 실패 : `, error);
        throw error;
    }
}

export const getMypageVotingScraps = async (nextCursorId : number | null, limit : number) : Promise<VotingScrapResponse> => {
    try{
        
        const response = await axiosInstance.get(`/api/debates/my-scrap`, {
            params: { nextCursorId, limit }
        })

        return response.data;
    }catch(error){
        console.log(`마이페이지 - 투표 불러오기 실패 : `, error);
        throw error;
    }
}