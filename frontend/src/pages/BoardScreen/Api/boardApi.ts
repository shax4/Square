import axios from "./Axios";

export const BoardAPI = {
  // 게시글 목록 조회
  getPosts: (
    sort: "latest" | "likes" = "latest",
    nextCursorId: number | null = null,
    nextCursorLikes: number | null = null,
    limit: number = 10
  ) => {
    const params: any = { sort, limit };
    if (nextCursorId) params.nextCursorId = nextCursorId;
    if (nextCursorLikes) params.nextCursorLikes = nextCursorLikes;

    return axios.get("/api/posts", { params });
  },
  // 특정 게시글 상세 조회
  getPostDetail: (postId: number) => axios.get(`/api/posts/${postId}`),

  // 게시글 생성
  createPost: (data: { title: string; content: string }) =>
    axios.post(`/api/posts`, data),

  // 게시글 수정
  updatePost: (postId: number, data: { title: string; content: string }) =>
    axios.put(`/api/posts/${postId}`, data),

  // 게시글 삭제
  deletePost: (postId: number) => axios.delete(`/api/posts/${postId}`),

  // 댓글 생성
  createComment: (postId: number, content: string) =>
    axios.post(`/api/comments`, { postId, content }),

  // 댓글 수정
  updateComment: (commentId: number, content: string) =>
    axios.put(`/api/comments/${commentId}`, { content }),

  // 댓글 삭제
  deleteComment: (commentId: number) =>
    axios.delete(`/api/comments/${commentId}`),
};
