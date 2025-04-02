import { axiosInstance } from "../../../shared";
import { PostResponse } from "../Type/mypagePost";

export const getMypagePosts = async (apiType : string, nextCursorId : number | null, limit : number) : Promise<PostResponse> => {
    try{
        const response = await axiosInstance.get(`/api/posts/${apiType}`, {
            params: { nextCursorId, limit }
        });

        return response.data;
    }catch(error){
        console.error(`${apiType} 게시글 불러오기 실패 :`, error);
        throw error;
    }
}