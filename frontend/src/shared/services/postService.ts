/**
 * 게시판 관련 API 연결을 담당하는 서비스 레이어
 * 게시글 조회, 생성, 수정, 삭제 등의 API 요청 함수들을 제공합니다.
 */

import { apiGet, apiPost, apiPut, apiDelete } from "../api/apiClient";
import { API_PATHS } from "../constants/apiConfig";
import { ApiResponse } from "../types/apiTypes";
import {
  Post,
  PostListResponse,
  PostDetailResponse,
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsParams,
} from "../types/postTypes";

/**
 * 게시판 서비스 - 게시글 관련 API 요청 함수 모음
 */
export const PostService = {
  /**
   * 게시글 목록 조회 함수
   * 최신순 또는 좋아요순으로 게시글 목록을 조회합니다.
   *
   * @param params 목록 조회 매개변수 (정렬 방식, 커서 ID, 제한 수)
   * @returns 게시글 목록 데이터를 포함한 Promise 객체
   */
  getPosts: async (
    params: GetPostsParams = {}
  ): Promise<ApiResponse<PostListResponse>> => {
    // 기본값 설정
    const queryParams = {
      sort: params.sort || "latest", // 기본값은 최신순
      limit: params.limit || 10, // 기본값은 10개
      ...(params.nextCursorId ? { nextCursorId: params.nextCursorId } : {}),
      ...(params.nextCursorLikes
        ? { nextCursorLikes: params.nextCursorLikes }
        : {}),
    };

    try {
      // API 호출
      return await apiGet<PostListResponse>(API_PATHS.POSTS.LIST, {
        params: queryParams,
      });
    } catch (error) {
      console.error("게시글 목록 조회 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 게시글 상세 정보 조회 함수
   * 특정 게시글의 상세 정보와 댓글 목록을 함께 조회합니다.
   *
   * @param postId 조회할 게시글 ID
   * @returns 게시글 상세 정보를 포함한 Promise 객체
   */
  getPostDetail: async (
    postId: number
  ): Promise<ApiResponse<PostDetailResponse>> => {
    try {
      return await apiGet<PostDetailResponse>(API_PATHS.POSTS.DETAIL(postId));
    } catch (error) {
      console.error(
        `게시글 ID ${postId} 상세 조회 API 호출 중 오류 발생:`,
        error
      );
      throw error;
    }
  },

  /**
   * 게시글 생성 함수
   * 새로운 게시글을 작성합니다.
   *
   * @param postData 게시글 생성 데이터 (제목, 내용, 이미지 키)
   * @returns 생성된 게시글 정보를 포함한 Promise 객체
   */
  createPost: async (
    postData: CreatePostRequest
  ): Promise<ApiResponse<{ postId: number }>> => {
    try {
      return await apiPost<{ postId: number }>(
        API_PATHS.POSTS.CREATE,
        postData
      );
    } catch (error) {
      console.error("게시글 생성 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  /**
   * 게시글 수정 함수
   * 기존 게시글의 내용을 수정합니다.
   *
   * @param postId 수정할 게시글 ID
   * @param updateData 수정할 데이터 (제목, 내용, 이미지 키)
   * @returns API 응답 데이터를 포함한 Promise 객체
   */
  updatePost: async (
    postId: number,
    updateData: UpdatePostRequest
  ): Promise<ApiResponse<any>> => {
    try {
      return await apiPut<any>(API_PATHS.POSTS.UPDATE(postId), updateData);
    } catch (error) {
      console.error(`게시글 ID ${postId} 수정 API 호출 중 오류 발생:`, error);
      throw error;
    }
  },

  /**
   * 게시글 삭제 함수
   * 특정 게시글을 삭제합니다.
   *
   * @param postId 삭제할 게시글 ID
   * @returns API 응답 데이터를 포함한 Promise 객체
   */
  deletePost: async (postId: number): Promise<ApiResponse<any>> => {
    try {
      return await apiDelete<any>(API_PATHS.POSTS.DELETE(postId));
    } catch (error) {
      console.error(`게시글 ID ${postId} 삭제 API 호출 중 오류 발생:`, error);
      throw error;
    }
  },

  /**
   * 내가 작성한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 작성한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 사용자 게시글 목록 데이터를 포함한 Promise 객체
   */
  getMyPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<ApiResponse<{ posts: Post[]; nextCursorId?: number }>> => {
    const queryParams = {
      limit,
      ...(nextCursorId ? { nextCursorId } : {}),
    };

    try {
      return await apiGet<{ posts: Post[]; nextCursorId?: number }>(
        API_PATHS.POSTS.MY_POSTS,
        { params: queryParams }
      );
    } catch (error) {
      console.error(
        "내가 작성한 게시글 목록 조회 API 호출 중 오류 발생:",
        error
      );
      throw error;
    }
  },

  /**
   * 내가 좋아요한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 좋아요한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 좋아요한 게시글 목록 데이터를 포함한 Promise 객체
   */
  getMyLikedPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<ApiResponse<{ posts: Post[]; nextCursorId?: number }>> => {
    const queryParams = {
      limit,
      ...(nextCursorId ? { nextCursorId } : {}),
    };

    try {
      return await apiGet<{ posts: Post[]; nextCursorId?: number }>(
        API_PATHS.POSTS.MY_LIKES,
        { params: queryParams }
      );
    } catch (error) {
      console.error(
        "내가 좋아요한 게시글 목록 조회 API 호출 중 오류 발생:",
        error
      );
      throw error;
    }
  },

  /**
   * 내가 스크랩한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 스크랩한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 스크랩한 게시글 목록 데이터를 포함한 Promise 객체
   */
  getMyScrapPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<ApiResponse<{ posts: Post[]; nextCursorId?: number }>> => {
    const queryParams = {
      limit,
      ...(nextCursorId ? { nextCursorId } : {}),
    };

    try {
      return await apiGet<{ posts: Post[]; nextCursorId?: number }>(
        API_PATHS.POSTS.MY_SCRAPS,
        { params: queryParams }
      );
    } catch (error) {
      console.error(
        "내가 스크랩한 게시글 목록 조회 API 호출 중 오류 발생:",
        error
      );
      throw error;
    }
  },
};

// 편의성을 위한 기본 내보내기
export default PostService;
