/**
 * 게시글 생성 및 수정을 위한 커스텀 훅
 * 폼 상태 관리, 이미지 업로드, 게시글 생성/수정 기능을 제공합니다.
 */

import { useState, useCallback, useEffect } from "react";
import { PostService, ImageService } from "../services";
import { CreatePostRequest, UpdatePostRequest, Post } from "../types/postTypes";

// 이미지 타입 (MIME 타입)
type ImageType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

// 이미지 파일 정보 인터페이스
interface ImageFile {
  file: File;
  preview: string;
  uploading: boolean;
  s3Key?: string;
  error?: string;
}

// 훅의 반환 타입 정의
interface UsePostFormReturn {
  // 폼 상태
  title: string; // 제목
  setTitle: (title: string) => void; // 제목 설정 함수
  content: string; // 내용
  setContent: (content: string) => void; // 내용 설정 함수
  images: ImageFile[]; // 이미지 파일 목록

  // 이미지 관리
  addImage: (file: File) => void; // 이미지 추가 함수
  removeImage: (index: number) => void; // 이미지 제거 함수

  // 폼 제출
  submitting: boolean; // 제출 중 상태
  submitError: Error | null; // 제출 에러 상태
  createPost: () => Promise<boolean>; // 게시글 생성 함수
  updatePost: (postId: number) => Promise<boolean>; // 게시글 수정 함수

  // 게시글 로드 (수정 시)
  loadPost: (postId: number) => Promise<void>; // 게시글 불러오기 함수
  loading: boolean; // 게시글 로딩 상태
  loadError: Error | null; // 게시글 로딩 에러

  // 폼 초기화
  resetForm: () => void; // 폼 초기화 함수
}

/**
 * 게시글 폼 관리 커스텀 훅
 * @returns 게시글 폼 관련 상태와 함수들
 */
export const usePostForm = (): UsePostFormReturn => {
  // 폼 상태 관리
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<ImageFile[]>([]);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  /**
   * 이미지 추가 함수
   * 미리보기를 생성하고 이미지 배열에 추가합니다.
   *
   * @param file 추가할 이미지 파일
   */
  const addImage = useCallback(
    (file: File) => {
      // 파일 타입 확인 (이미지만 허용)
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        alert("JPG, PNG, GIF, WEBP 형식의 이미지만 업로드 가능합니다.");
        return;
      }

      // 파일 크기 제한 (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert("이미지 크기는 5MB 이하여야 합니다.");
        return;
      }

      // 이미지 개수 제한 (최대 3개)
      if (images.length >= 3) {
        alert("이미지는 최대 3개까지 업로드 가능합니다.");
        return;
      }

      // 미리보기 URL 생성
      const preview = URL.createObjectURL(file);

      // 이미지 배열에 추가
      setImages((prev) => [...prev, { file, preview, uploading: false }]);
    },
    [images]
  );

  /**
   * 이미지 제거 함수
   *
   * @param index 제거할 이미지 인덱스
   */
  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const newImages = [...prev];

      // 미리보기 URL 해제
      URL.revokeObjectURL(newImages[index].preview);

      // 배열에서 제거
      newImages.splice(index, 1);
      return newImages;
    });
  }, []);

  /**
   * 모든 이미지 업로드 함수
   * 모든 이미지를 S3에 업로드하고 s3Key 배열을 반환합니다.
   *
   * @returns 업로드된 이미지의 s3Key 배열
   */
  const uploadAllImages = useCallback(async (): Promise<string[]> => {
    // 이미지가 없으면 빈 배열 반환
    if (images.length === 0) {
      return [];
    }

    // 이미 업로드된 s3Key가 있는 이미지는 바로 추가
    const s3Keys: string[] = [];
    const uploadsNeeded: number[] = [];

    // 업로드가 필요한 이미지 인덱스 수집
    images.forEach((image, index) => {
      if (image.s3Key) {
        s3Keys.push(image.s3Key);
      } else {
        uploadsNeeded.push(index);
      }
    });

    // 업로드할 이미지가 없으면 기존 s3Key 반환
    if (uploadsNeeded.length === 0) {
      return s3Keys;
    }

    // 각 이미지 업로드 상태 표시
    setImages((prev) => {
      const newImages = [...prev];
      uploadsNeeded.forEach((index) => {
        newImages[index] = { ...newImages[index], uploading: true };
      });
      return newImages;
    });

    // 병렬로 모든 이미지 업로드
    try {
      const uploadPromises = uploadsNeeded.map(async (index) => {
        const image = images[index];
        const contentType = image.file.type as ImageType;

        try {
          // S3에 이미지 업로드
          const s3Key = await ImageService.uploadImage(image.file, contentType);

          // 업로드 상태 업데이트
          setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = {
              ...newImages[index],
              uploading: false,
              s3Key,
            };
            return newImages;
          });

          return s3Key;
        } catch (err) {
          // 개별 이미지 오류 처리
          setImages((prev) => {
            const newImages = [...prev];
            newImages[index] = {
              ...newImages[index],
              uploading: false,
              error: "업로드 실패",
            };
            return newImages;
          });

          throw err;
        }
      });

      // 모든 업로드 완료 대기
      const uploadedKeys = await Promise.all(uploadPromises);

      // 기존 키와 새로 업로드된 키 합치기
      return [...s3Keys, ...uploadedKeys];
    } catch (err) {
      console.error("이미지 업로드 중 오류 발생:", err);
      throw new Error("일부 이미지 업로드에 실패했습니다.");
    }
  }, [images]);

  /**
   * 게시글 생성 함수
   *
   * @returns 성공 여부(boolean)
   */
  const createPost = useCallback(async (): Promise<boolean> => {
    // 필수 입력 확인
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return false;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return false;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // 1. 모든 이미지 업로드
      const s3Keys = await uploadAllImages();

      // 2. 게시글 생성 요청 데이터 구성
      const postData: CreatePostRequest = {
        title: title.trim(),
        content: content.trim(),
      };

      // 이미지가 있으면 추가
      if (s3Keys.length > 0) {
        postData.postImage = s3Keys;
      }

      // 3. API 호출
      const success = await PostService.createPost(postData);

      // 4. 결과 처리
      if (success) {
        console.log("게시글 생성 성공");
        return true;
      }

      // 실패 처리
      console.warn("게시글 생성 요청 실패");
      setSubmitError(new Error("게시글 생성 요청에 실패했습니다."));
      return false;
    } catch (err) {
      console.error("게시글 생성 중 예외 발생:", err);

      setSubmitError(
        err instanceof Error
          ? err
          : new Error("게시글 작성 중 오류가 발생했습니다.")
      );

      return false;
    } finally {
      setSubmitting(false);
    }
  }, [title, content, uploadAllImages]);

  /**
   * 게시글 수정 함수
   *
   * @param postId 수정할 게시글 ID
   * @returns 성공 여부
   */
  const updatePost = useCallback(
    async (postId: number): Promise<boolean> => {
      // 필수 입력 확인
      if (!title.trim()) {
        alert("제목을 입력해주세요.");
        return false;
      }

      if (!content.trim()) {
        alert("내용을 입력해주세요.");
        return false;
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        // 1. 모든 이미지 업로드
        const s3Keys = await uploadAllImages();

        // 2. 게시글 수정 요청 데이터 구성
        const updateData: UpdatePostRequest = {
          title: title.trim(),
          content: content.trim(),
          // API 명세에 맞게 필드명 수정
          addedImages: [], // 현재 이미지 업로드 기능 미구현으로 빈 배열 전송
          deletedImages: [], // 현재 이미지 삭제 기능 미구현으로 빈 배열 전송
        };

        // 이미지가 있으면 추가
        if (s3Keys.length > 0) {
          updateData.postImage = s3Keys;
          // 이미지 업로드 기능이 구현되면 아래 코드 활성화
          // updateData.addedImages = s3Keys;
        }

        // 3. API 호출 - 이제 boolean 값을 반환
        const success = await PostService.updatePost(postId, updateData);

        // 4. 결과 처리
        if (success) {
          console.log("게시글 수정 성공:", postId);
          return true;
        } else {
          setSubmitError(new Error("게시글 수정에 실패했습니다."));
          return false;
        }
      } catch (err) {
        console.error("게시글 수정 오류:", err);

        setSubmitError(
          err instanceof Error
            ? err
            : new Error("게시글 수정 중 오류가 발생했습니다.")
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [title, content, uploadAllImages]
  );

  /**
   * 게시글 불러오기 함수 (수정 시 사용)
   *
   * @param postId 불러올 게시글 ID
   */
  const loadPost = useCallback(async (postId: number): Promise<void> => {
    setLoading(true);
    setLoadError(null);

    try {
      // API 호출
      const postDetail = await PostService.getPostDetail(postId);

      // 응답 데이터 처리
      if (postDetail) {
        // 폼 데이터 설정
        setTitle(postDetail.title);
        setContent(postDetail.content);

        // 이미지 데이터 설정
        if (postDetail.images && postDetail.images.length > 0) {
          // 이미지 데이터를 ImageFile 형식으로 변환
          const loadedImages = postDetail.images.map((img) => ({
            file: new File([], img.s3Key), // 빈 파일 객체 (s3Key만 사용)
            preview: img.imageUrl,
            uploading: false,
            s3Key: img.s3Key,
          }));

          setImages(loadedImages);
        }
      }
    } catch (err) {
      setLoadError(
        err instanceof Error
          ? err
          : new Error("게시글 정보를 불러오는 중 오류가 발생했습니다.")
      );
      console.error(`게시글 ID ${postId} 불러오기 오류:`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 폼 초기화 함수
   */
  const resetForm = useCallback(() => {
    // 미리보기 URL 해제
    images.forEach((image) => {
      URL.revokeObjectURL(image.preview);
    });

    // 상태 초기화
    setTitle("");
    setContent("");
    setImages([]);
    setSubmitError(null);
    setLoadError(null);
  }, [images]);

  // 컴포넌트 언마운트 시 미리보기 URL 정리
  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.preview);
      });
    };
  }, [images]);

  return {
    title,
    setTitle,
    content,
    setContent,
    images,
    addImage,
    removeImage,
    submitting,
    submitError,
    createPost,
    updatePost,
    loadPost,
    loading,
    loadError,
    resetForm,
  };
};

export default usePostForm;
