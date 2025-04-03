import { axiosInstance } from "../../../shared";
import { OpinionResponse } from "../Type/mypageOpinion";

export const getMypageOpinions = async (nextCursorId : number | null, limit : number) : Promise<OpinionResponse> => {
    try{
        const response = await axiosInstance.get('/api/opinions/my', {
            params: { nextCursorId, limit }
        })

        return response.data;
    }catch(error){
        console.error(`마이페이지 의견 불러오기 실패 :`, error);
        throw error;
    }
}