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
    // postId가 유효하지 않으면 함수 종료 (숫자가 아니거나 0 이하)
    if (!postId || postId <= 0) {
      console.warn("유효하지 않은 postId 입니다:", postId);
      setError(new Error("잘못된 게시글 ID 입니다."));
      setLoading(false);
      setPost(null);
      setComments([]);
      return;
    }

    console.log(`🚀 게시글 ID ${postId} 상세 정보 로드 시작`);
    setLoading(true); // 로딩 시작
    setError(null); // 이전 에러 초기화

    try {
      // API 호출: PostService.getPostDetail은 PostDetailResponse | undefined 반환
      const responseData: PostDetailResponse | undefined =
        await PostService.getPostDetail(postId);

      // *** 중요 수정: responseData 자체를 확인 ***
      if (responseData) {
        // responseData가 존재하고 유효한 경우
        console.log(
          `✅ 게시글 ID ${postId} 상세 데이터 수신 성공:`,
          JSON.stringify(responseData, null, 2)
        );
        setPost(responseData); // post 상태 업데이트

        // 댓글 목록 업데이트 (존재하고 배열일 경우)
        if (responseData.comments && Array.isArray(responseData.comments)) {
          setComments(responseData.comments);
          console.log(`📄 댓글 ${responseData.comments.length}개 업데이트`);
        } else {
          setComments([]); // 댓글 없으면 빈 배열
          console.log("💬 댓글 데이터 없음.");
        }
        setError(null); // 성공 시 에러 상태 초기화
      } else {
        // API 호출은 성공했으나 응답 데이터가 없는 경우 (responseData가 undefined)
        console.warn(
          `⚠️ 게시글 ID ${postId} 상세 데이터 수신 실패 (responseData is undefined)`
        );
        setError(new Error("게시글 정보를 찾을 수 없습니다.")); // 에러 상태 설정
        setPost(null); // post 상태 null로 설정
        setComments([]);
      }
    } catch (err) {
      // API 호출 자체에서 에러 발생 시 (네트워크 오류 등)
      console.error(`❌ 게시글 ID ${postId} 상세 정보 로딩 중 예외 발생:`, err);
      setError(
        err instanceof Error
          ? err
          : new Error("게시글 상세 정보를 불러오는 중 오류가 발생했습니다.")
      );
      setPost(null); // 에러 시 post 상태 null
      setComments([]);
    } finally {
      setLoading(false); // 로딩 종료
      console.log(`🏁 게시글 ID ${postId} 상세 정보 로딩 상태 종료`);
    }
  }, [postId]); // postId가 변경될 때만 함수 재생성

  /**
   * 게시글 상세 정보 새로고침 함수
   */
  const refresh = useCallback(() => {
    console.log(`🔄 게시글 ID ${postId} 상세 정보 새로고침 요청`);
    loadPostDetail(); // loadPostDetail 함수 재호출
  }, [loadPostDetail]); // loadPostDetail 참조가 변경될 때만 함수 재생성

  // 컴포넌트 마운트 시 또는 postId 변경 시 상세 정보 로드
  useEffect(() => {
    console.log(`훅 마운트 또는 postId 변경 (${postId}): 상세 정보 로드`);
    loadPostDetail(); // 마운트 시 또는 postId 변경 시 loadPostDetail 호출
  }, [loadPostDetail]); // loadPostDetail 참조 변경 시 (즉, postId 변경 시) useEffect 재실행

  return {
    post,
    loading,
    error,
    refresh,
    comments,
  };
};

export default usePostDetail;
