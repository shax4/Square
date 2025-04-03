import { axiosInstance } from "../../../shared";
import { DebatesResponse } from "./DebatesResponse.types";

export const getAllDebates = async (nextCursorId: number | null, limit: number): Promise<DebatesResponse> => {
    try {
        const params: any = { limit };

        // nextCursorId가 null이 아닐 때만 params에 포함
        if (nextCursorId !== null) {
            params.nextCursorId = nextCursorId;
        }
        const response = await axiosInstance.get('/api/debates', { params });

        return response.data;
    } catch (error) {
        console.error("논쟁 주제 받아오기 실패:", error);
        throw error;
    }
}
