/**
 * 댓글 관련 API 연결을 담당하는 서비스 레이어
 * 댓글 생성, 수정, 삭제, 대댓글 조회 등의 API 요청 함수들을 제공합니다.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse } from "../types/apiTypes";
import {
  Comment,
  Reply,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateCommentResponse,
  GetRepliesParams,
  RepliesResponse,
} from "../types/postTypes";

/**
 * 댓글 서비스 - 댓글 관련 API 요청 함수 모음
 */
export const CommentService = {
  /**
   * 댓글 생성 함수
   * 게시글에 새 댓글을 작성합니다.
   * parentCommentId가 있으면 대댓글을 작성합니다.
   *
   * @param commentData 댓글 생성 데이터 (게시글 ID, 부모 댓글 ID(선택), 내용)
   * @returns 생성된 댓글 정보를 포함한 Promise 객체
   */
  createComment: async (
    commentData: CreateCommentRequest
  ): Promise<ApiResponse<CreateCommentResponse>> => {
    try {
      return await apiPost<CreateCommentResponse>(
        API_PATHS.COMMENTS.CREATE,
        commentData
      );
    } catch (error) {
      console.error("댓글 생성 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 댓글 수정 함수
   * 기존 댓글의 내용을 수정합니다.
   *
   * @param commentId 수정할 댓글 ID
   * @param updateData 수정할 내용
   * @returns API 응답 데이터를 포함한 Promise 객체
   */
  updateComment: async (
    commentId: number,
    updateData: UpdateCommentRequest
  ): Promise<ApiResponse<any>> => {
    try {
      return await apiPut<any>(
        API_PATHS.COMMENTS.UPDATE(commentId),
        updateData
      );
    } catch (error) {
      console.error(`댓글 ID ${commentId} 수정 API 호출 중 오류 발생:`, error);
      throw error;
    }
  },

  /**
   * 댓글 삭제 함수
   * 특정 댓글을 삭제합니다.
   *
   * @param commentId 삭제할 댓글 ID
   * @returns API 응답 데이터를 포함한 Promise 객체
   */
  deleteComment: async (commentId: number): Promise<ApiResponse<any>> => {
    try {
      return await apiDelete<any>(API_PATHS.COMMENTS.DELETE(commentId));
    } catch (error) {
      console.error(`댓글 ID ${commentId} 삭제 API 호출 중 오류 발생:`, error);
      throw error;
    }
  },

  /**
   * 대댓글 목록 조회 함수
   * 특정 댓글에 달린 대댓글 목록을 조회합니다.
   *
   * @param params 대댓글 조회 매개변수 (댓글 ID, 커서 ID, 제한 수)
   * @returns 대댓글 목록 데이터를 포함한 Promise 객체
   */
  getReplies: async (
    params: GetRepliesParams
  ): Promise<ApiResponse<RepliesResponse>> => {
    // 기본값 설정
    const queryParams = {
      limit: params.limit || 9, // 기본값은 9개
      ...(params.nextCursorId ? { nextCursorId: params.nextCursorId } : {}),
    };

    try {
      return await apiGet<RepliesResponse>(
        API_PATHS.COMMENTS.REPLIES(params.commentId),
        { params: queryParams }
      );
    } catch (error) {
      console.error(
        `댓글 ID ${params.commentId}의 대댓글 목록 조회 API 호출 중 오류 발생:`,
        error
      );
      throw error;
    }
  },

  /**
   * 내가 작성한 댓글 목록 조회 함수
   * 현재 로그인한 사용자가 작성한 댓글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 댓글 수 (선택 사항)
   * @returns 사용자 댓글 목록 데이터를 포함한 Promise 객체
   */
  getMyComments: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<ApiResponse<{ comments: Comment[]; nextCursorId?: number }>> => {
    const queryParams = {
      limit,
      ...(nextCursorId ? { nextCursorId } : {}),
    };

    try {
      return await apiGet<{ comments: Comment[]; nextCursorId?: number }>(
        API_PATHS.COMMENTS.MY_COMMENTS,
        { params: queryParams }
      );
    } catch (error) {
      console.error("내가 작성한 댓글 목록 조회 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 특정 댓글에 대한 답글 목록 조회 (더보기 기능)
   * GET /comments/{commentId} API 호출 (Swagger 기준)
   * @param commentId 상위 댓글 ID
   * @param nextCursorId 다음 페이지 커서 ID (마지막으로 조회된 답글 ID)
   * @param limit 페이지당 답글 수 (기본값: 9)
   * @returns 답글 목록 데이터 또는 undefined
   */
  getCommentReplies: async ({
    commentId,
    nextCursorId,
    limit = 9, // 요구사항에 맞춰 기본값 9로 설정
  }: GetRepliesParams): Promise<RepliesResponse | undefined> => {
    // API 경로 설정 (API_PATHS 사용 권장하나, 여기서는 직접 구성)
    const path = `/api/comments/${commentId}`;

    // 쿼리 파라미터 구성
    const queryParams: { limit: number; nextCursorId?: number } = { limit };
    if (nextCursorId) {
      queryParams.nextCursorId = nextCursorId;
    }

    try {
      // apiGet 호출 (반환 타입: RepliesResponse | undefined)
      const result = await apiGet<RepliesResponse>(path, {
        params: queryParams,
      });
      console.log(`댓글 ${commentId} 답글 조회 API 응답:`, result); // 응답 로깅
      return result;
    } catch (error) {
      console.error(`댓글 ID ${commentId} 답글 목록 조회 API 오류:`, error);
      return undefined;
    }
  },
};

// 편의성을 위한 기본 내보내기
export default CommentService;
