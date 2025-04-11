import { axiosInstance } from "../../../shared";
import { Comment } from "../Components/Comment.types";
import { OpinionsResponse } from "../Components/OpinionsResponse.types";

interface commentResponse {
    commentId: number,
    profileUrl: string,
}

export const getOpinionDetail = async (
    commentId: number,
): Promise<OpinionsResponse> => {
    try {
        const response = await axiosInstance.get(`/api/opinions/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("의견 상세 조회 실패:", error);
        throw error;
    }
}

export const createComment = async (
    opinionId: number,
    content: String,
): Promise<commentResponse> => {
    try {
        const response = await axiosInstance.post('/api/opinions/comments',
            {
                opinionId: opinionId,
                content: content,
            }
        );
        return response.data;
    } catch (error) {
        console.error("의견 생성 실패:", error);
        throw error;
    }
};

export const updateComment = async (
    commentId: number,
    content: String,
): Promise<commentResponse> => {
    try {
        const response = await axiosInstance.put(`/api/opinions/comments/${commentId}`,
            {
                commentId: commentId,
                content: content,
            }
        );
        return response.data;
    } catch (error) {
        console.error("의견 업데이트 실패:", error);
        throw error;
    }
};

export const deleteComment = async (
    commentId: number,
) => {
    try {
        const response = await axiosInstance.delete(`/api/opinions/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("의견 삭제 실패:", error);
        throw error;
    }
};


export const likesComment = async (
    targetId: number,
) => {
    try {
        const targetType = 'OPINION_COMMENT';
        const response = await axiosInstance.post('/api/likes', {
            targetType: targetType,
            targetId: targetId
        });
        return response.data;
    } catch (error) {
        console.error("댓글 좋아요 실패:", error);
        throw error;
    }
}