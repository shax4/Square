/**
 * 댓글 생성 및 관리를 위한 커스텀 훅
 * 댓글 작성, 수정, 삭제, 대댓글 로드 등의 기능을 제공합니다.
 */

import { useState, useCallback } from "react";
import { CommentService } from "../services";
import {
  Comment,
  Reply,
  CreateCommentRequest,
  UpdateCommentRequest,
  GetRepliesParams,
  RepliesResponse,
} from "../types/postTypes";

// 훅의 반환 타입 정의
interface UseCommentReturn {
  // 댓글 생성 관련
  commentText: string; // 댓글 입력 텍스트
  setCommentText: (text: string) => void; // 댓글 텍스트 설정 함수
  submitting: boolean; // 제출 중 상태
  submitError: Error | null; // 제출 에러 상태
  createComment: (postId: number, parentCommentId?: number) => Promise<boolean>; // 댓글 생성 함수

  // 댓글 수정/삭제 관련
  updateComment: (commentId: number, content: string) => Promise<boolean>; // 댓글 수정 함수
  deleteComment: (commentId: number) => Promise<boolean>; // 댓글 삭제 함수

  // 대댓글 로드 관련
  loadingReplies: boolean; // 대댓글 로딩 상태
  replyError: Error | null; // 대댓글 에러 상태
  loadReplies: (
    commentId: number,
    nextCursorId?: number
  ) => Promise<RepliesResponse | undefined>; // 대댓글 로드 함수
}

/**
 * 댓글 관리 커스텀 훅
 * @returns 댓글 관련 상태와 함수들
 */
export const useComment = (): UseCommentReturn => {
  // 상태 관리
  const [commentText, setCommentText] = useState<string>(""); // 댓글 입력 텍스트
  const [submitting, setSubmitting] = useState<boolean>(false); // 제출 중 상태
  const [submitError, setSubmitError] = useState<Error | null>(null); // 제출 에러 상태
  const [loadingReplies, setLoadingReplies] = useState<boolean>(false); // 대댓글 로딩 상태
  const [replyError, setReplyError] = useState<Error | null>(null); // 대댓글 에러 상태

  /**
   * 댓글 생성 함수
   * 게시글에 댓글 또는 대댓글을 작성합니다.
   *
   * @param postId 게시글 ID
   * @param parentCommentId 부모 댓글 ID (대댓글인 경우)
   * @returns 성공 여부
   */
  const createComment = useCallback(
    async (postId: number, parentCommentId?: number): Promise<boolean> => {
      if (!commentText.trim()) {
        return false;
      }

      setSubmitting(true);
      setSubmitError(null);

      try {
        // 댓글 요청 데이터 구성
        const commentData: CreateCommentRequest = {
          postId,
          content: commentText.trim(),
          ...(parentCommentId && { parentId: parentCommentId }),
        };

        console.log("📄 댓글/답글 생성 API 요청 본문:", commentData); // 요청 본문 로깅 추가

        // API 호출
        await CommentService.createComment(commentData);

        // 성공 시 입력 필드 초기화
        setCommentText("");
        return true;
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err
            : new Error("댓글 작성 중 오류가 발생했습니다.")
        );
        console.error("댓글/답글 작성 오류:", err);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [commentText]
  );

  /**
   * 댓글 수정 함수
   * 기존 댓글의 내용을 수정합니다.
   *
   * @param commentId 수정할 댓글 ID
   * @param content 수정할 내용
   * @returns 성공 여부
   */
  const updateComment = useCallback(
    async (commentId: number, content: string): Promise<boolean> => {
      if (!content.trim()) {
        return false;
      }

      try {
        // 수정 요청 데이터 구성
        const updateData: UpdateCommentRequest = {
          content: content.trim(),
        };

        // API 호출
        await CommentService.updateComment(commentId, updateData);
        return true;
      } catch (err) {
        console.error(`댓글 ID ${commentId} 수정 오류:`, err);
        return false;
      }
    },
    []
  );

  /**
   * 댓글 삭제 함수
   * 특정 댓글을 삭제합니다.
   *
   * @param commentId 삭제할 댓글 ID
   * @returns 성공 여부
   */
  const deleteComment = useCallback(
    async (commentId: number): Promise<boolean> => {
      try {
        // API 호출
        await CommentService.deleteComment(commentId);
        return true;
      } catch (err) {
        console.error(`댓글 ID ${commentId} 삭제 오류:`, err);
        return false;
      }
    },
    []
  );

  /**
   * 대댓글 목록 로드 함수 (더보기 기능)
   * @param commentId 댓글 ID
   * @param nextCursorId 다음 페이지 커서 ID
   * @returns RepliesResponse 객체 또는 undefined
   */
  const loadReplies = useCallback(
    async (
      commentId: number,
      nextCursorId?: number
    ): Promise<RepliesResponse | undefined> => {
      console.log(
        `대댓글 로드 요청: commentId=${commentId}, nextCursorId=${nextCursorId}`
      );
      setLoadingReplies(true);
      setReplyError(null);

      try {
        // 요청 파라미터 구성 (limit은 Service에서 기본값 9로 설정됨)
        const params: GetRepliesParams = { commentId };
        if (nextCursorId) {
          params.nextCursorId = nextCursorId;
        }

        // API 호출
        const response = await CommentService.getCommentReplies(params);

        // API 응답 처리
        if (response) {
          console.log("대댓글 로드 성공:", response);
          return response; // RepliesResponse 객체 반환
        } else {
          console.log("대댓글 로드 실패 또는 데이터 없음 (undefined 반환)");
          return undefined; // API 실패 또는 데이터 없을 시 undefined 반환
        }
      } catch (err) {
        // CommentService에서 처리하지 못한 예외
        console.error(`댓글 ID ${commentId}의 대댓글 로드 중 예외 발생:`, err);
        setReplyError(
          err instanceof Error
            ? err
            : new Error("대댓글을 불러오는 중 오류가 발생했습니다.")
        );
        return undefined; // 에러 시 undefined 반환
      } finally {
        setLoadingReplies(false);
        console.log(`대댓글 로드 종료: commentId=${commentId}`);
      }
    },
    []
  );

  return {
    commentText,
    setCommentText,
    submitting,
    submitError,
    createComment,
    updateComment,
    deleteComment,
    loadingReplies,
    replyError,
    loadReplies,
  };
};

export default useComment;
