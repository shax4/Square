import { axiosInstance } from "../../../shared";

export interface voteResult {
    leftCount: number,
    rightCount: number,
}

export const voteDebate = async (debateId: number, isLeft: boolean): Promise<voteResult> => {
    try {
        const response = await axiosInstance.post(`/api/debates/vote/${debateId}`,
            {
                isLeft: isLeft,
            }
        );
        return response.data;
    } catch (error) {
        console.error("투표 POST 요청 실패:", error);
        throw error;
    }
}
