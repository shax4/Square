import { axiosInstance } from "../../../shared";
import { DebatesResponse } from "./DebatesResponse.types";

export const getAllDebates = async (nextCursorId: number | null, limit: number): Promise<DebatesResponse> => {
    
    try {
        const response = await axiosInstance.get('/api/debates', {
            params: {
                nextCursorId: nextCursorId,
                limit: limit,
            },
        });

        return response.data;
    } catch (error) {
        console.error("논쟁 주제 받아오기 실패:", error);
        throw error;
    }
}