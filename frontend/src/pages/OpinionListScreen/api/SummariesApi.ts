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