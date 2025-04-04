import { axiosInstance } from "../../../shared";
import { Comment } from "../Components/Comment.types";

export const createComment = async (
    commentId: number,
    content: String,
): Promise<Comment> => {
    try {
        const response = await axiosInstance.post('/api/opinions/comments',
            {
                commentId: commentId,
                content: content,
            }
        );
        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};

export const updateOpinionDetail = async (
    commentId: number,
    content: String,
): Promise<Comment> => {
    try {
        const response = await axiosInstance.put(`/api/opinions/comments/${commentId}`,
            {
                commentId: commentId,
                content: content,
            }
        );
        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};

export const deleteOpinionDetail = async (
    commentId: number,
) => {
    try {
        const response = await axiosInstance.delete(`/api/opinions/comments/${commentId}`);
        return response.data;
    } catch (error) {
        console.error("의견 받아오기 실패:", error);
        throw error;
    }
};