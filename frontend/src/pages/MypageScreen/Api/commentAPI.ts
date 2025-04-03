import { axiosInstance } from "../../../shared";
import { CommentResponse } from "../Type/mypageComment";

export const getMypageComments = async (nextCursorId : number | null, limit : number) : Promise<CommentResponse> => {
    try{
        const response = await axiosInstance.get(`/api/comments/my`, {
            params: { nextCursorId, limit }
        });

        return response.data;
    }catch(error){
        console.error(`마이페이지 댓글 불러오기 실패 :`, error);
        throw error;
    }
}