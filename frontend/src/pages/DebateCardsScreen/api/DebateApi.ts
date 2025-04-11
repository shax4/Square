import { axiosInstance } from "../../../shared";
import { Debate } from "../Components";
import { DebatesResponse } from "./DebatesResponse.types";

export const getAllDebates = async (
  nextCursorId: number | null,
  limit: number
): Promise<DebatesResponse> => {
  try {
    const params: any = { limit };

    // nextCursorId가 null이 아닐 때만 params에 포함
    if (nextCursorId !== null) {
      params.nextCursorId = nextCursorId;
    }
    const response = await axiosInstance.get("/api/debates", { params });

    return response.data;
  } catch (error) {
    console.debug("논쟁 주제 받아오기 실패:", error);
    throw error;
  }
};

export const scrapDebate = async (
  targetId: number
) => {
  try {
    const response = await axiosInstance.post("/api/scraps", {
      targetId: targetId,
      targetType: "DEBATE"
    });
    return response.data;
  } catch (error) {
    console.debug("스크랩 실패:", targetId);
    throw error;
  }
};

export const scrapDebateUndo = async (
  targetId: number
) => {
  try {
    const response = await axiosInstance.delete("/api/scraps", {
      params: {
        targetId: targetId,
        targetType: "DEBATE"
      }
    });
    return response.data;
  } catch (error) {
    console.debug("스크랩 취소 실패:", targetId);
    throw error;
  }
};


export const getDebateById = async (
  debateId: number,
): Promise<DebatesResponse> => {
  try {
    const response = await axiosInstance.get("/api/debates", {
      params: {
        nextCursorId: debateId + 1,
        limit: 1
      }
    });

    return response.data;
  } catch (error) {
    console.debug("논쟁 주제 받아오기 실패:", error);
    throw error;
  }
};