import { DebateResultData } from "../../../pages/DebateResultModal/DebateResultData.types";
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

export const getDebateVoteResult = async (debateId: number): Promise<DebateResultData> => {
    try {
        const response = await axiosInstance.get(`/api/debates/${debateId}/result`);
        return response.data;
    } catch (error) {
        console.debug("논쟁 통계 조회 실패:", error);
        throw error;
    }
}
