/**
 * 게시판 API 관련 통신을 담당하는 모듈
 * 게시글, 댓글, 스크랩 등의 기능을 REST API로 처리합니다.
 *
 * @module BoardAPI
 */

// 개발용 mock api 사용 (실제 API 구현 시 주석 처리)
// import { MockBoardAPI } from "../mocks/boardApi";
// export const BoardAPI = MockBoardAPI;

// 실제 API 코드
import axios from "../../../shared/api/apiClient";
import { AxiosResponse } from "axios";
import { Post, Reply } from "../board.types";
import { API_PATHS } from "../../../shared/constants/apiConfig";

/**
 * 대댓글 목록 조회 응답 타입 정의
 * @interface RepliesResponse
 */
interface RepliesResponse {
  /** 대댓글 목록 */
  replies: Array<Reply>; // items → replies
  /** 다음 페이지 커서 ID (무한 스크롤) */
  nextCursorId: number | null; // nextCursor.id → nextCursorId
}

/**
 * 인기 게시글 타입 정의
 * @interface PopularPost
 */
interface PopularPost {
  /** 게시글 ID */
  postId: number;
  /** 게시글 제목 */
  title: string;
  /** 게시글 작성일시 */
  createdAt: string;
  /** 좋아요 수 */
  likeCount: number;
  /** 댓글 수 */
  commentCount: number;
}

/**
 * 게시글 목록 응답 타입 정의
 * @interface PostsResponse
 */
interface PostsResponse {
  /** 사용자 유형 */
  userType: string | null;
  /** 인기 게시글 목록 (optional) */
  popular?: PopularPost[];
  /** 게시글 목록 */
  posts: Array<Post>; // items → posts
  /** 다음 페이지 커서 ID (최신순 정렬) */
  nextCursorId: number | null;
  /** 다음 페이지 커서 좋아요 수 (인기순 정렬) */
  nextCursorLikes: number | null;
}

/**
 * 게시판 관련 API 요청 객체
 * 게시글 조회/생성/수정/삭제 및 댓글 관련 기능을 제공합니다.
 */
export const BoardAPI = {
  /**
   * 게시글 목록을 조회합니다.
   *
   * @param {('latest'|'likes')} sort - 정렬 방식 (최신순/인기순)
   * @param {number|null} nextCursorId - 다음 페이지 커서 ID (최신순)
   * @param {number|null} nextCursorLikes - 다음 페이지 커서 좋아요 수 (인기순)
   * @param {number} limit - 한 번에 가져올 게시글 수
   * @returns {Promise<AxiosResponse<PostsResponse>>} 게시글 목록 응답
   */
  getPosts: (
    sort: "latest" | "likes" = "latest",
    nextCursorId: number | null = null,
    nextCursorLikes: number | null = null,
    limit: number = 10
  ): Promise<AxiosResponse<PostsResponse>> => {
    const params: any = { sort, limit };
    if (nextCursorId) params.nextCursorId = nextCursorId;
    if (nextCursorLikes) params.nextCursorLikes = nextCursorLikes;

    return axios.get(API_PATHS.POSTS.LIST, { params });
  },

  /**
   * 내가 작성한 게시글 목록을 조회합니다.
   *
   * @param {number|null} nextCursorId - 다음 페이지 커서 ID
   * @param {number} limit - 한 번에 가져올 게시글 수
   * @returns {Promise<AxiosResponse<PostsResponse>>} 내 게시글 목록 응답
   */
  getMyPosts: (
    nextCursorId: number | null = null,
    limit: number = 10
  ): Promise<AxiosResponse<PostsResponse>> => {
    const params: any = { limit };
    if (nextCursorId) params.nextCursorId = nextCursorId;

    return axios.get(API_PATHS.POSTS.MY_POSTS, { params });
  },

  /**
   * 내가 좋아요한 게시글 목록을 조회합니다.
   *
   * @param {number|null} nextCursorId - 다음 페이지 커서 ID
   * @param {number} limit - 한 번에 가져올 게시글 수
   * @returns {Promise<AxiosResponse<PostsResponse>>} 좋아요한 게시글 목록 응답
   */
  getMyLikedPosts: (
    nextCursorId: number | null = null,
    limit: number = 10
  ): Promise<AxiosResponse<PostsResponse>> => {
    const params: any = { limit };
    if (nextCursorId) params.nextCursorId = nextCursorId;

    return axios.get(API_PATHS.POSTS.MY_LIKES, { params });
  },

  /**
   * 내가 스크랩한 게시글 목록을 조회합니다.
   *
   * @param {number|null} nextCursorId - 다음 페이지 커서 ID
   * @param {number} limit - 한 번에 가져올 게시글 수
   * @returns {Promise<AxiosResponse<PostsResponse>>} 스크랩한 게시글 목록 응답
   */
  getMyScrappedPosts: (
    nextCursorId: number | null = null,
    limit: number = 10
  ): Promise<AxiosResponse<PostsResponse>> => {
    const params: any = { limit };
    if (nextCursorId) params.nextCursorId = nextCursorId;

    return axios.get(API_PATHS.POSTS.MY_SCRAPS, { params });
  },

  /**
   * 특정 게시글의 상세 정보를 조회합니다.
   *
   * @param {number} postId - 조회할 게시글 ID
   * @returns {Promise<AxiosResponse<Post>>} 게시글 상세 정보 응답
   */
  getPostDetail: (postId: number): Promise<AxiosResponse<Post>> =>
    axios.get(API_PATHS.POSTS.DETAIL(postId)),

  /**
   * 새 게시글을 생성합니다.
   *
   * @param {Object} data - 게시글 데이터
   * @param {string} data.title - 게시글 제목
   * @param {string} data.content - 게시글 내용
   * @param {string[]} [data.postImage] - 이미지 키 배열 (선택 사항)
   * @returns {Promise<AxiosResponse<{postId: number}>>} 생성된 게시글 ID 응답
   */
  createPost: (data: {
    title: string;
    content: string;
    postImage?: string[];
  }): Promise<AxiosResponse<{ postId: number }>> =>
    axios.post(API_PATHS.POSTS.CREATE, data),

  /**
   * 기존 게시글을 수정합니다.
   *
   * @param {number} postId - 수정할 게시글 ID
   * @param {Object} data - 수정할 게시글 데이터
   * @param {string} data.title - 게시글 제목
   * @param {string} data.content - 게시글 내용
   * @param {string[]} [data.postImage] - 이미지 키 배열 (선택 사항)
   * @returns {Promise<AxiosResponse<Post>>} 수정된 게시글 정보 응답
   */
  updatePost: (
    postId: number,
    data: { title: string; content: string; postImage?: string[] }
  ): Promise<AxiosResponse<Post>> =>
    axios.put(API_PATHS.POSTS.UPDATE(postId), data),

  /**
   * 게시글을 삭제합니다.
   *
   * @param {number} postId - 삭제할 게시글 ID
   * @returns {Promise<AxiosResponse<void>>} 삭제 결과 응답
   */
  deletePost: (postId: number): Promise<AxiosResponse<void>> =>
    axios.delete(API_PATHS.POSTS.DELETE(postId)),

  /**
   * 특정 댓글의 대댓글 목록을 조회합니다.
   *
   * @param {number} commentId - 조회할 댓글 ID
   * @param {number|null} [nextCursorId] - 다음 페이지 커서 ID (무한 스크롤)
   * @returns {Promise<AxiosResponse<RepliesResponse>>} 대댓글 목록 응답
   */
  getMoreReplies: (
    commentId: number,
    nextCursorId?: number | null
  ): Promise<AxiosResponse<RepliesResponse>> =>
    axios.get(API_PATHS.COMMENTS.REPLIES(commentId), {
      params: { nextCursorId, limit: 9 },
    }),

  /**
   * 게시글에 댓글을 작성합니다.
   *
   * @param {number} postId - 댓글을 작성할 게시글 ID
   * @param {string} content - 댓글 내용
   * @param {number} [parentCommentId] - 부모 댓글 ID (대댓글인 경우)
   * @returns {Promise<AxiosResponse<{commentId: number, profileUrl?: string}>>} 생성된 댓글 정보 응답
   */
  createComment: (
    postId: number,
    content: string,
    parentCommentId?: number
  ): Promise<AxiosResponse<{ commentId: number; profileUrl?: string }>> =>
    axios.post(API_PATHS.COMMENTS.CREATE, { postId, content, parentCommentId }),

  /**
   * 기존 댓글을 수정합니다.
   *
   * @param {number} commentId - 수정할 댓글 ID
   * @param {string} content - 수정할 댓글 내용
   * @returns {Promise<AxiosResponse<void>>} 수정 결과 응답
   */
  updateComment: (
    commentId: number,
    content: string
  ): Promise<AxiosResponse<void>> =>
    axios.put(API_PATHS.COMMENTS.UPDATE(commentId), { content }),

  /**
   * 댓글을 삭제합니다.
   *
   * @param {number} commentId - 삭제할 댓글 ID
   * @returns {Promise<AxiosResponse<void>>} 삭제 결과 응답
   */
  deleteComment: (commentId: number): Promise<AxiosResponse<void>> =>
    axios.delete(API_PATHS.COMMENTS.DELETE(commentId)),

  /**
   * 게시글 스크랩 상태를 토글합니다.
   *
   * @param {number} postId - 스크랩할 게시글 ID
   * @returns {Promise<AxiosResponse<{isScrapped: boolean}>>} 스크랩 상태 응답
   */
  toggleScrap: (
    postId: number
  ): Promise<AxiosResponse<{ isScrapped: boolean }>> =>
    axios.post(API_PATHS.LIKES.TOGGLE, {
      targetId: postId,
      targetType: "POST",
    }),
};
