/**
 * 이미지 업로드 관련 API 연결을 담당하는 서비스 레이어
 * 이미지 업로드에 필요한 presigned URL 획득 및 업로드 함수를 제공합니다.
 */

import { apiGet, apiPost } from "../api/apiClient";
import axios from "axios";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse } from "../types/apiTypes";

// 이미지 타입 (MIME 타입)
type ImageType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

// Presigned URL 획득 요청 타입
interface PresignedUrlRequest {
  contentType: ImageType;
  size?: number; // 파일 크기 (바이트)
}

// Presigned URL 응답 타입
interface PresignedUrlResponse {
  presignedUrl: string;
  s3Key: string;
}

/**
 * 이미지 서비스 - 이미지 업로드 관련 API 요청 함수 모음
 */
export const ImageService = {
  /**
   * 이미지 업로드용 presigned URL 획득 함수
   * S3에 이미지를 업로드하기 위한 presigned URL을 얻습니다.
   *
   * @param contentType 이미지 MIME 타입 (예: "image/jpeg")
   * @param size 이미지 파일 크기 (바이트, 선택 사항)
   * @returns presigned URL과 S3 키를 포함한 Promise 객체
   */
  getPresignedUrl: async (
    contentType: ImageType,
    size?: number
  ): Promise<ApiResponse<PresignedUrlResponse>> => {
    const request: PresignedUrlRequest = {
      contentType,
      size,
    };

    try {
      return await apiPost<PresignedUrlResponse>(
        API_PATHS.IMAGE.PRESIGNED_URL,
        request
      );
    } catch (error) {
      console.error("Presigned URL 획득 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 이미지 파일 업로드 함수
   * Presigned URL을 사용하여 이미지 파일을 S3에 직접 업로드합니다.
   *
   * @param presignedUrl 업로드용 presigned URL
   * @param file 업로드할 파일 (File 객체)
   * @param contentType 이미지 MIME 타입
   * @returns 업로드 성공 여부를 포함한 Promise 객체
   */
  uploadImageToS3: async (
    presignedUrl: string,
    file: File | Blob,
    contentType: ImageType
  ): Promise<boolean> => {
    try {
      // PUT 요청으로 파일 직접 업로드
      await axios.put(presignedUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });

      return true;
    } catch (error) {
      console.error("S3 이미지 업로드 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 이미지 업로드 통합 함수
   * 1단계: presigned URL 획득
   * 2단계: S3에 이미지 업로드
   *
   * @param file 업로드할 파일 (File 객체)
   * @param contentType 이미지 MIME 타입
   * @returns 업로드 성공 시 S3 키를 포함한 Promise 객체
   */
  uploadImage: async (
    file: File | Blob,
    contentType: ImageType
  ): Promise<string> => {
    try {
      // 1. Presigned URL 획득
      const response = await ImageService.getPresignedUrl(
        contentType,
        file.size
      );

      if (!response.data) {
        throw new Error("Presigned URL 획득 실패");
      }

      const { presignedUrl, s3Key } = response.data;

      // 2. S3에 이미지 업로드
      const uploadSuccess = await ImageService.uploadImageToS3(
        presignedUrl,
        file,
        contentType
      );

      if (!uploadSuccess) {
        throw new Error("이미지 업로드 실패");
      }

      // 성공 시 S3 키 반환
      return s3Key;
    } catch (error) {
      console.error("이미지 업로드 프로세스 중 오류 발생:", error);
      throw error;
    }
  },
};

// 편의성을 위한 기본 내보내기
export default ImageService;
