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
import { TargetTypeEnum } from "../../components/LikeButton/LikeButton.types";

/**
 * 게시판 서비스 - 게시글 관련 API 요청 함수 모음
 */
export const PostService = {
  /**
   * 게시글 목록 조회 함수
   * 최신순 또는 좋아요순으로 게시글 목록을 조회합니다.
   *
   * @param params 목록 조회 매개변수 (정렬 방식, 커서 ID, 제한 수)
   * @returns 실제 게시글 목록 데이터(PostListResponse) 또는 에러 시 undefined를 포함하는 Promise 객체
   */
  getPosts: async (
    params: GetPostsParams = {}
  ): Promise<PostListResponse | undefined> => {
    const queryParams = {
      sort: params.sort || "latest",
      limit: params.limit || 10,
      ...(params.nextCursorId ? { nextCursorId: params.nextCursorId } : {}),
      ...(params.nextCursorLikes
        ? { nextCursorLikes: params.nextCursorLikes }
        : {}),
    };
    try {
      // apiClient의 apiGet에서 이미 에러를 로깅하고 undefined를 반환함
      const result = await apiGet<PostListResponse>(API_PATHS.POSTS.LIST, {
        params: queryParams,
      });
      return result; // 성공 시 PostListResponse, 실패 시 undefined
    } catch (error) {
      // 추가적인 로깅이나 처리가 필요하다면 여기에 작성
      // console.error("PostService.getPosts에서 추가 오류 처리:", error);
      // apiClient에서 undefined를 반환하므로 여기서도 undefined 반환
      return undefined;
    }
  },

  /**
   * 게시글 상세 정보 조회 함수
   * 특정 게시글의 상세 정보와 댓글 목록을 함께 조회합니다.
   *
   * @param postId 조회할 게시글 ID
   * @returns 게시글 상세 정보를 포함한 Promise 객체 (실제로는 PostDetailResponse | undefined)
   */
  getPostDetail: async (
    postId: number
  ): Promise<PostDetailResponse | undefined> => {
    try {
      return await apiGet<PostDetailResponse>(API_PATHS.POSTS.DETAIL(postId));
    } catch (error) {
      // console.error("PostService.getPostDetail에서 추가 오류 처리:", error);
      return undefined;
    }
  },

  /**
   * 게시글 생성 함수
   * 새로운 게시글을 작성합니다.
   *
   * @param postData 게시글 생성 데이터 (제목, 내용, 이미지 키)
   * @returns 성공 여부(boolean)를 포함하는 Promise
   */
  createPost: async (postData: CreatePostRequest): Promise<boolean> => {
    console.log(
      "[PostService] 게시글 생성 요청: 제목 길이",
      postData.title.length
    );
    try {
      const response = await apiPost<any>(API_PATHS.POSTS.CREATE, postData);

      // API 호출이 성공했으면 true 반환
      // 응답 본문이 없어도 상관없음 (API 명세에 따르면 응답 본문이 없음)
      if (response !== undefined) {
        console.log("[PostService] 게시글 생성 성공");
        return true;
      }

      console.error("[PostService] 게시글 생성 응답 없음");
      return false;
    } catch (error) {
      console.error("[PostService] 게시글 생성 실패");
      if (error && typeof error === "object" && "response" in error) {
        // @ts-ignore
        console.error("[PostService] 오류 상태 코드:", error.response?.status);
      }
      return false;
    }
  },

  /**
   * 게시글 수정 함수
   * 기존 게시글의 내용을 수정합니다.
   *
   * @param postId 수정할 게시글 ID
   * @param updateData 수정할 데이터 (제목, 내용, 이미지 키)
   * @returns 성공 시 true, 실패 시 false를 포함하는 Promise
   */
  updatePost: async (
    postId: number,
    updateData: UpdatePostRequest
  ): Promise<boolean> => {
    console.log("[PostService] 게시글 수정 요청: ID", postId);
    try {
      const response = await apiPut<any>(
        API_PATHS.POSTS.UPDATE(postId),
        updateData
      );

      // 응답이 존재하면 성공
      console.log("[PostService] 게시글 수정 성공: ID", postId);

      // 응답이 있거나, 응답이 비어있더라도 요청이 성공했으므로 true 반환
      return true;
    } catch (error) {
      console.error("[PostService] 게시글 수정 실패");
      if (error && typeof error === "object" && "response" in error) {
        // @ts-ignore
        console.error("[PostService] 오류 상태 코드:", error.response?.status);
      }
      return false;
    }
  },

  /**
   * 게시글 삭제 함수
   * 특정 게시글을 삭제합니다.
   *
   * @param postId 삭제할 게시글 ID
   * @returns 성공 시 응답 데이터(any) 또는 undefined 를 포함하는 Promise (추후 구체화 필요)
   */
  deletePost: async (postId: number): Promise<any | undefined> => {
    try {
      return await apiDelete<any>(API_PATHS.POSTS.DELETE(postId));
    } catch (error) {
      // console.error("PostService.deletePost에서 추가 오류 처리:", error);
      return undefined;
    }
  },

  /**
   * 내가 작성한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 작성한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 사용자 게시글 목록 데이터 또는 undefined 를 포함하는 Promise
   */
  getMyPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<{ posts: Post[]; nextCursorId?: number } | undefined> => {
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
      // console.error("PostService.getMyPosts에서 추가 오류 처리:", error);
      return undefined;
    }
  },

  /**
   * 내가 좋아요한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 좋아요한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 좋아요한 게시글 목록 데이터 또는 undefined 를 포함하는 Promise
   */
  getMyLikedPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<{ posts: Post[]; nextCursorId?: number } | undefined> => {
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
      // console.error("PostService.getMyLikedPosts에서 추가 오류 처리:", error);
      return undefined;
    }
  },

  /**
   * 내가 스크랩한 게시글 목록 조회 함수
   * 현재 로그인한 사용자가 스크랩한 게시글 목록을 조회합니다.
   *
   * @param nextCursorId 다음 페이지 커서 ID (선택 사항)
   * @param limit 페이지당 게시글 수 (선택 사항)
   * @returns 스크랩한 게시글 목록 데이터 또는 undefined 를 포함하는 Promise
   */
  getMyScrapPosts: async (
    nextCursorId?: number,
    limit: number = 10
  ): Promise<{ posts: Post[]; nextCursorId?: number } | undefined> => {
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
      // console.error("PostService.getMyScrapPosts에서 추가 오류 처리:", error);
      return undefined;
    }
  },

  /**
   * 게시글 스크랩 토글 함수
   * 게시글을 스크랩하거나 스크랩을 취소합니다.
   *
   * @param postId 스크랩할 게시글 ID
   * @param targetType 스크랩 대상 타입 (기본값: 게시글)
   * @returns 스크랩 상태 (isScrapped)
   */
  toggleScrap: async (
    postId: number,
    targetType: TargetTypeEnum = TargetTypeEnum.POST
  ): Promise<{ isScrapped: boolean } | undefined> => {
    try {
      const requestData = {
        targetId: postId,
        targetType: targetType,
      };
      // 테스트용 로그 추가
      console.log("📤 스크랩 생성 요청 데이터:", JSON.stringify(requestData));

      return await apiPost<{ isScrapped: boolean }>("/api/scraps", requestData);
    } catch (error) {
      console.error("PostService.toggleScrap 실패:", error);
      return undefined;
    }
  },

  /**
   * 게시글 스크랩 취소 함수
   *
   * @param postId 스크랩 취소할 게시글 ID
   * @param targetType 스크랩 대상 타입 (기본값: 게시글)
   * @returns 취소 성공 여부
   */
  cancelScrap: async (
    postId: number,
    targetType: TargetTypeEnum = TargetTypeEnum.POST
  ): Promise<boolean> => {
    try {
      const requestParams = {
        targetId: postId,
        targetType: targetType,
      };
      // 테스트용 로그 추가
      console.log(
        "📤 스크랩 취소 요청 파라미터:",
        JSON.stringify(requestParams)
      );

      await apiDelete("/api/scraps", {
        params: requestParams,
      });
      return true;
    } catch (error) {
      console.error("PostService.cancelScrap 실패:", error);
      return false;
    }
  },
};

// 편의성을 위한 기본 내보내기
export default PostService;
