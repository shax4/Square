import { axiosInstance } from "../../../shared";
import { OpinionsResponse } from "../Components/OpinionsResponse.types";

export const getOpinionDetail = async (
    opinionId: number,
): Promise<OpinionsResponse> => {
    try {
        const response = await axiosInstance.get(`/api/opinions/${opinionId}`);
        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};

export const likesOpinion = async (
    targetId: number,
) => {
    try {
        const targetType = 'OPINION';
        const response = await axiosInstance.post('/api/likes', {
            targetType: targetType,
            targetId: targetId
        });
        return response.data;
    } catch (error) {
        console.error("의견 좋아요 실패:", error);
        throw error;
    }
}