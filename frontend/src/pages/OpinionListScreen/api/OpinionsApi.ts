import { axiosInstance } from "../../../shared";
import { OpinionsResponse } from "./OpinionsResponse.types";

export interface GetOpinionsParams {
    sort?: 'latest' | 'likes' | 'comments';
    nextLeftCursorId?: number | null;
    nextLeftCursorLikes?: number | null;
    nextLeftCursorComments?: number | null;
    nextRightCursorId?: number | null;
    nextRightCursorLikes?: number | null;
    nextRightCursorComments?: number | null;
    limit?: number;
}

export const getOpinions = async (
    debateId: number,
    params: GetOpinionsParams = {}
): Promise<OpinionsResponse> => {
    try {
        const response = await axiosInstance.get(`/api/debates/${debateId}/opinions`, {
            params: {
                sort: params.sort ?? 'latest',
                nextLeftCursorId: params.nextLeftCursorId,
                nextLeftCursorLikes: params.nextLeftCursorLikes,
                nextLeftCursorComments: params.nextLeftCursorComments,
                nextRightCursorId: params.nextRightCursorId,
                nextRightCursorLikes: params.nextRightCursorLikes,
                nextRightCursorComments: params.nextRightCursorComments,
                limit: params.limit ?? 10,
            },
        });

        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};
