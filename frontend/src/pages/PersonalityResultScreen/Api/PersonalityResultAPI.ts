import axiosInstance from "../../../shared/api/axiosInstance"
import { TypeResult } from "../../../shared/types/typeResult";

export const getMyPersonalityResult = async (): Promise<TypeResult> => {
  try {
    const response = await axiosInstance.get("/api/type/my");

    return response.data;
  } catch (error) {
    console.error("내 성향 테스트 결과 받아오기 실패:", error);
    throw error;
  }
}

export const getOthersPersonalityResult = async (nickname: string): Promise<TypeResult> => {
  try {
    const response = await axiosInstance.get("/api/type/other", { params: { nickname } });

    return response.data;
  } catch (error) {
    console.error("다른 사람 성향 테스트 결과 받아오기 실패:", error);
    throw error;
  }
}

export const getUserTypeImagePresignedUrl = async (fileName: string, contentType: string, folder: string) => {
  try {
    const response = await axiosInstance.post('/api/s3/presigned-put', {
      fileName,
      contentType,
      folder,
    });

    return response.data; // { presignedPutUrl, s3Key }
  } catch (error) {
      console.debug("S3 이미지 저장 실패:", error)
  } 
};