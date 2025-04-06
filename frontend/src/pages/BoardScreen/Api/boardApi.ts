// 개발용 mock api 사용
import { MockBoardAPI } from "../mocks/boardApi";
import { TargetType } from "../../../components/LikeButton/LikeButton.types";

export const BoardAPI = MockBoardAPI;

// 실제 API 코드
// import axios from "../../../shared/api/axiosInstance";
// import { AxiosResponse } from "axios";
// import { LikeResponse, Post, Reply } from "../board.types";

// // API 응답 타입 정의
// // 대댓글 목록 조회 응답 타입 정의
// interface RepliesResponse {
//   replies: Array<Reply>; // items → replies
//   nextCursorId: number | null; // nextCursor.id → nextCursorId
// }

// // 인기 게시글 타입
// interface PopularPost {
//   postId: number;
//   title: string;
//   createdAt: string;
//   likeCount: number;
//   commentCount: number;
// }

// // 게시글 목록 응답 타입 정의
// interface PostsResponse {
//   userType: string | null;
//   popular?: PopularPost[]; // 인기 게시글 목록 (optional)
//   posts: Array<Post>; // items → posts
//   nextCursorId: number | null;
//   nextCursorLikes: number | null;
// }

// export const BoardAPI = {
//   // 게시글 목록 조회
//   getPosts: (
//     sort: "latest" | "likes" = "latest",
//     nextCursorId: number | null = null,
//     nextCursorLikes: number | null = null,
//     limit: number = 10
//   ): Promise<AxiosResponse<PostsResponse>> => {
//     const params: any = { sort, limit };
//     if (nextCursorId) params.nextCursorId = nextCursorId;
//     if (nextCursorLikes) params.nextCursorLikes = nextCursorLikes;

//     return axios.get("/api/posts", { params });
//   },

//   // 내가 작성한 게시글 목록 조회
//   getMyPosts: (
//     nextCursorId: number | null = null,
//     limit: number = 10
//   ): Promise<AxiosResponse<PostsResponse>> => {
//     const params: any = { limit };
//     if (nextCursorId) params.nextCursorId = nextCursorId;

//     return axios.get("/api/posts/my", { params });
//   },

//   // 내가 좋아요한 게시글 목록 조회
//   getMyLikedPosts: (
//     nextCursorId: number | null = null,
//     limit: number = 10
//   ): Promise<AxiosResponse<PostsResponse>> => {
//     const params: any = { limit };
//     if (nextCursorId) params.nextCursorId = nextCursorId;

//     return axios.get("/api/posts/my-likes", { params });
//   },

//   // 내가 스크랩한 게시글 목록 조회
//   getMyScrappedPosts: (
//     nextCursorId: number | null = null,
//     limit: number = 10
//   ): Promise<AxiosResponse<PostsResponse>> => {
//     const params: any = { limit };
//     if (nextCursorId) params.nextCursorId = nextCursorId;

//     return axios.get("/api/posts/my-scraps", { params });
//   },

//   // 특정 게시글 상세 조회
//   getPostDetail: (postId: number): Promise<AxiosResponse<Post>> =>
//     axios.get(`/api/posts/${postId}`),

//   // 게시글 생성
//   createPost: (data: {
//     title: string;
//     content: string;
//   }): Promise<AxiosResponse<{ postId: number }>> =>
//     axios.post(`/api/posts`, data),

//   // 게시글 수정
//   updatePost: (
//     postId: number,
//     data: { title: string; content: string }
//   ): Promise<AxiosResponse<Post>> => axios.put(`/api/posts/${postId}`, data),

//   // 게시글 삭제
//   deletePost: (postId: number): Promise<AxiosResponse<void>> =>
//     axios.delete(`/api/posts/${postId}`),

//   // 대댓글 목록 조회 (GET /api/comments/{commentId})
//   getMoreReplies: (
//     commentId: number,
//     nextCursorId?: number | null
//   ): Promise<AxiosResponse<RepliesResponse>> =>
//     axios.get(`/api/comments/${commentId}`, {
//       params: { nextCursorId, limit: 9 },
//     }),

//   // 댓글 생성 (parentCommentId 추가)
//   createComment: (
//     postId: number,
//     content: string,
//     parentCommentId?: number
//   ): Promise<AxiosResponse<{ commentId: number; profileUrl?: string }>> =>
//     axios.post(`/api/comments`, { postId, content, parentCommentId }),

//   // 댓글 수정
//   updateComment: (
//     commentId: number,
//     content: string
//   ): Promise<AxiosResponse<void>> =>
//     axios.put(`/api/comments/${commentId}`, { content }),

//   // 댓글 삭제
//   deleteComment: (commentId: number): Promise<AxiosResponse<void>> =>
//     axios.delete(`/api/comments/${commentId}`),

//   // 스크랩 생성
//   createScrap: (
//     postId: number
//   ): Promise<AxiosResponse<{ isScrapped: boolean }>> =>
//     axios.post(`/api/scraps`, { targetId: postId, targetType: "POST" }),

//   // 스크랩 삭제
//   deleteScrap: (
//     postId: number
//   ): Promise<AxiosResponse<{ isScrapped: boolean }>> =>
//     axios.delete(`/api/scraps`, {
//       data: { targetId: postId, targetType: "POST" },
//     }),

//   // 댓글/대댓글/게시글 좋아요 토글 함수
//   toggleLike: async (
//     targetId: number,
//     targetType: TargetType
//   ): Promise<{ data: LikeResponse }> => {
//     try {
//       const response = await axios.post(`/api/likes`, {
//         targetType,
//         targetId,
//       });
//       return response;
//     } catch (error) {
//       throw new Error("Failed to toggle like");
//     }
//   },
// };
