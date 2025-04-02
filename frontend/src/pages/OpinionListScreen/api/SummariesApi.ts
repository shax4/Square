import { axiosInstance } from "../../../shared";
import { SummariesResponse } from "./SummariesResponse.types";

export const getSummaries = async (debateId: number): Promise<SummariesResponse> => {
    try {
        const response = await axiosInstance.get(`/api/debates/${debateId}/summary`);
        return response.data;
    } catch (error) {
        console.error("AI 요약 받아오기 실패:", error);
        throw error;
    }
}

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
    }
}

export const deleteOpinion = async (opinionId: number) => {
    try {
        const response = await axiosInstance.put(`/api/opinions/${opinionId}`);
        return response.data;
    } catch (error) {
        console.error("SummariesApi.deleteOpinion DELETE 요청 실패:", error);
    }
}
