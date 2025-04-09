/**
 * 댓글 생성 및 관리를 위한 커스텀 훅
 * 댓글 작성, 수정, 삭제, 대댓글 로드 등의 기능을 제공합니다.
 */

import { useState, useCallback } from "react";
import { Alert } from "react-native";
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
      const trimmedComment = commentText.trim();

      // *** 유효성 검사 및 통합 알림 ***
      if (
        !trimmedComment ||
        trimmedComment.length < 5 ||
        trimmedComment.length > 150
      ) {
        let message = "댓글 내용을 입력해주세요.";
        if (
          trimmedComment &&
          (trimmedComment.length < 5 || trimmedComment.length > 150)
        ) {
          message = "댓글은 5자 이상 150자 이하로 입력해주세요.";
        }
        Alert.alert("알림", message);
        return false; // 유효성 검사 실패 시 API 호출 안 함
      }
      // Client-side 150자 초과 검사 추가

      setSubmitting(true);
      setSubmitError(null); // 요청 시작 시 에러 초기화

      try {
        // *** 요청 데이터 객체 생성 (postId 포함) ***
        const requestData: CreateCommentRequest = {
          postId: postId, // postId 포함
          content: trimmedComment,
          ...(parentCommentId !== undefined && { parentId: parentCommentId }),
        };

        console.log("📄 댓글/답글 생성 API 요청 본문:", requestData); // 요청 데이터 확인

        // *** CommentService.createComment 호출 방식 변경: 단일 객체 전달 ***
        const response = await CommentService.createComment(requestData);

        // *** 응답 확인 및 성공 처리 (CommentService가 undefined 반환 가능) ***
        if (response) {
          console.log("✅ 댓글/답글 생성 성공, 응답:", response);
          setCommentText(""); // 입력창 초기화
          return true;
        } else {
          // CommentService 내부에서 오류 처리 및 Alert가 발생했을 수 있음
          // 또는 추가적인 실패 처리 필요 시 여기에 작성
          console.warn("댓글/답글 생성 결과가 undefined입니다.");
          // setSubmitError(new Error("댓글 생성 요청 처리 중 문제가 발생했습니다.")); // 필요시
          return false;
        }
      } catch (err) {
        // useComment 레벨의 예외 처리 (네트워크 오류 등)
        setSubmitError(
          err instanceof Error
            ? err
            : new Error("댓글 작성 중 오류가 발생했습니다.")
        );
        console.error("댓글/답글 작성 오류:", err);
        Alert.alert(
          "오류",
          err instanceof Error
            ? err.message
            : "댓글 생성 중 오류가 발생했습니다. 다시 시도해 주세요."
        );
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [commentText] // postId는 useCallback의 인자로 직접 받으므로 의존성 배열 불필요
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
      const trimmedContent = content.trim();

      // *** 유효성 검사 및 통합 알림 ***
      if (
        !trimmedContent ||
        trimmedContent.length < 5 ||
        trimmedContent.length > 150
      ) {
        let message = "댓글 내용을 입력해주세요.";
        if (
          trimmedContent &&
          (trimmedContent.length < 5 || trimmedContent.length > 150)
        ) {
          message = "댓글은 5자 이상 150자 이하로 입력해주세요.";
        }
        Alert.alert("알림", message);
        return false; // 유효성 검사 실패 시 API 호출 안 함
      }
      // Client-side 150자 초과 검사 추가

      setSubmitting(true);
      setSubmitError(null); // 요청 시작 시 에러 초기화

      try {
        // 수정 요청 데이터 구성
        const updateData: UpdateCommentRequest = {
          content: trimmedContent,
        };

        // API 호출
        await CommentService.updateComment(commentId, updateData);
        return true;
      } catch (err) {
        console.error(`댓글 ID ${commentId} 수정 오류:`, err);
        setSubmitError(
          err instanceof Error
            ? err
            : new Error("댓글 수정 중 오류가 발생했습니다.")
        );
        Alert.alert(
          "오류",
          err instanceof Error
            ? err.message
            : "댓글 수정 중 오류가 발생했습니다."
        );
        return false;
      } finally {
        setSubmitting(false);
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
      setSubmitting(true);
      setSubmitError(null);

      try {
        // API 호출
        await CommentService.deleteComment(commentId);
        return true;
      } catch (err) {
        console.error(`댓글 ID ${commentId} 삭제 오류:`, err);
        setSubmitError(
          err instanceof Error
            ? err
            : new Error("댓글 삭제 중 오류가 발생했습니다.")
        );
        Alert.alert(
          "오류",
          err instanceof Error
            ? err.message
            : "댓글 삭제 중 오류가 발생했습니다."
        );
        return false;
      } finally {
        setSubmitting(false);
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
        Alert.alert(
          "오류",
          err instanceof Error
            ? err.message
            : "대댓글을 불러오는 중 오류가 발생했습니다."
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
