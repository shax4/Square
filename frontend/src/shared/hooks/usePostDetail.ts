/**
 * 게시글 상세 정보 조회를 위한 커스텀 훅
 * 특정 게시글의 상세 정보와 댓글을 불러옵니다.
 */

import { useState, useEffect, useCallback } from "react";
import { PostService } from "../services";
import { PostDetailResponse, Comment } from "../types/postTypes";

// 훅의 반환 타입 정의
interface UsePostDetailReturn {
  post: PostDetailResponse | null; // 게시글 상세 정보
  loading: boolean; // 로딩 상태
  error: Error | null; // 에러 상태
  refresh: () => void; // 상세 정보 새로고침 함수
  comments: Comment[]; // 댓글 목록 (별도 관리)
}

/**
 * 게시글 상세 정보 조회 커스텀 훅
 * @param postId 조회할 게시글 ID
 * @returns 게시글 상세 정보 관련 상태와 함수들
 */
export const usePostDetail = (postId: number): UsePostDetailReturn => {
  // 상태 관리
  const [post, setPost] = useState<PostDetailResponse | null>(null); // 게시글 상세 정보
  const [comments, setComments] = useState<Comment[]>([]); // 댓글 목록
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<Error | null>(null); // 에러 상태

  /**
   * 게시글 상세 정보를 불러오는 함수
   */
  const loadPostDetail = useCallback(async () => {
    if (!postId) return;

    setLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await PostService.getPostDetail(postId);

      // 응답 데이터 처리
      if (response && response.data) {
        setPost(response.data);

        // 댓글 목록 별도 관리 (댓글 관련 기능에서 활용)
        if (response.data.comments) {
          setComments(response.data.comments);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("게시글 상세 정보를 불러오는 중 오류가 발생했습니다.")
      );
      console.error(`게시글 ID ${postId} 상세 정보 로딩 오류:`, err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  /**
   * 게시글 상세 정보 새로고침 함수
   */
  const refresh = useCallback(() => {
    loadPostDetail();
  }, [loadPostDetail]);

  // 컴포넌트 마운트 시 또는 postId 변경 시 상세 정보 로드
  useEffect(() => {
    loadPostDetail();
  }, [loadPostDetail, postId]);

  return {
    post,
    loading,
    error,
    refresh,
    comments,
  };
};

export default usePostDetail;
