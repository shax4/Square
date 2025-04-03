import { axiosInstance } from "../../../shared";
import { OpinionsResponse } from "./OpinionsResponse.types";
import { SortType } from "../OpinionSortType";

export interface GetOpinionsParams {
    sort?: SortType;
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
        
        const response = await axiosInstance.get(`/api/debates/${debateId}`, {
            params: {
                sort: params.sort ?? SortType.Latest,
                nextLeftCursorId: params.nextLeftCursorId,
                nextLeftCursorLikes: params.nextLeftCursorLikes,
                nextLeftCursorComments: params.nextLeftCursorComments,
                nextRightCursorId: params.nextRightCursorId,
                nextRightCursorLikes: params.nextRightCursorLikes,
                nextRightCursorComments: params.nextRightCursorComments,
                limit: params.limit ?? 5,
            },
        });

        const queryParams = {
            sort: params.sort ?? SortType.Latest,
            nextLeftCursorId: params.nextLeftCursorId,
            nextLeftCursorLikes: params.nextLeftCursorLikes,
            nextLeftCursorComments: params.nextLeftCursorComments,
            nextRightCursorId: params.nextRightCursorId,
            nextRightCursorLikes: params.nextRightCursorLikes,
            nextRightCursorComments: params.nextRightCursorComments,
            limit: params.limit ?? 5,
        };

        // URL 문자열 생성 및 출력
        const queryString = new URLSearchParams(
            Object.entries(queryParams)
                .filter(([_, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [key, String(value)])
        ).toString();

        const fullUrl = `/api/debates/${debateId}?${queryString}`;
        console.log("📡 생성된 요청 URL:", fullUrl);


        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};


export const createOpinion = async (debateId: number, isLeft: boolean, content: string) => {
    try {
        const response = await axiosInstance.post('/api/opinions', {
            debateId,
            isLeft,
            content,
        });
        return response.data;
    } catch (error) {
        console.error("SummariesApi.createOpinion POST 요청 실패:", error);
        throw error;
    }
}


export const updateOpinion = async (opinionId: number, content: string) => {
    try {
        const response = await axiosInstance.put(`/api/opinions/${opinionId}`, {
            content,
        });
        return response.data;
    } catch (error) {
        console.error("SummariesApi.updateOpinion PUT 요청 실패:", error);
        throw error;
    }
}

export const deleteOpinion = async (opinionId: number) => {
    try {
        const response = await axiosInstance.put(`/api/opinions/${opinionId}`);
        return response.data;
    } catch (error) {
        console.error("SummariesApi.deleteOpinion DELETE 요청 실패:", error);
        throw error;
    }
}