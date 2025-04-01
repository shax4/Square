import { Post, Comment, Reply } from "../board.types";
import {
  mockPosts,
  mockPopularPosts,
  currentUser,
  mockAllReplies,
} from "./boardData";

export const MockBoardAPI = {
  // 게시글 목록 조회
  getPosts: (
    sort: "latest" | "likes" = "latest",
    nextCursorId: number | null = null,
    nextCursorLikes: number | null = null,
    limit: number = 10
  ) => {
    // 정렬 방식에 따라 게시글 정렬
    let sortedPosts = [...mockPosts];
    if (sort === "likes") {
      sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      sortedPosts.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    // 커서 기반 페이지네이션 구현 (간단한 구현)
    if (nextCursorId) {
      sortedPosts = sortedPosts.filter((post) => post.postId < nextCursorId);
    }

    // 데이터 크기 제한
    const posts = sortedPosts.slice(0, limit);

    // API 응답 형식에 맞춰 데이터 반환
    return Promise.resolve({
      data: {
        userType: currentUser.userType,
        popular: mockPopularPosts,
        posts,
        nextCursorId:
          posts.length > 0 ? posts[posts.length - 1].postId - 1 : null,
        nextCursorLikes: null,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  },

  // 게시글 상세 조회
  getPostDetail: (postId: number) => {
    const post = mockPosts.find((p) => p.postId === postId);

    if (!post) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: "Not Found",
          data: { message: "게시글을 찾을 수 없습니다." },
        },
      });
    }

    return Promise.resolve({
      data: post,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  },

  // 게시글 생성
  createPost: (data: { title: string; content: string }) => {
    const newPost = {
      postId: Math.max(...mockPosts.map((p) => p.postId)) + 1,
      nickname: currentUser.nickname,
      profileUrl: currentUser.profileUrl,
      userType: currentUser.userType,
      createdAt: new Date().toISOString(),
      title: data.title,
      content: data.content,
      likeCount: 0,
      commentCount: 0,
      isLiked: false,
      isScrapped: false,
      comments: [],
    };

    mockPosts.unshift(newPost); // 새 게시글을 mockPosts 배열의 최상단에 추가

    return Promise.resolve({
      data: newPost,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  },

  // 게시글 수정
  updatePost: (postId: number, data: { title: string; content: string }) => {
    const postIndex = mockPosts.findIndex((p) => p.postId === postId);

    if (postIndex === -1) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: "Not Found",
          data: { message: "게시글을 찾을 수 없습니다." },
        },
      });
    }

    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      title: data.title,
      content: data.content,
    };

    return Promise.resolve({
      data: mockPosts[postIndex],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  },

  // 게시글 삭제
  deletePost: (postId: number) => {
    const postIndex = mockPosts.findIndex((p) => p.postId === postId);

    if (postIndex === -1) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: "Not Found",
          data: { message: "게시글을 찾을 수 없습니다." },
        },
      });
    }

    mockPosts.splice(postIndex, 1);

    return Promise.resolve({
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    });
  },

  /**
   * [신규 추가] 특정 댓글에 대한 대댓글 목록 조회 (더보기 기능용)
   * @param commentId 부모 댓글 ID
   * @param nextCursorId 다음 페이지 시작점 ID (목업에서는 간단히 사용)
   * @param limit 페이지당 개수 (목업에서는 고정값 사용 가능)
   */
  getMoreReplies: (
    commentId: number,
    nextCursorId?: number | null
  ): Promise<{ data: { replies: Reply[]; nextCursorId: number | null } }> => {
    return new Promise((resolve) => {
      console.log(
        `[Mock API] getMoreReplies called: parentCommentId=${commentId}, nextCursorId=${nextCursorId}`
      );
      const allReplies = mockAllReplies[commentId] || []; // 해당 부모 댓글의 전체 대댓글 목록 가져오기
      const limit = 9; // API 명세서 기준 (또는 원하는 개수)

      let startIndex = 0;
      if (nextCursorId) {
        // 실제 커서는 단순 ID 비교보다 복잡할 수 있음 (예: 생성 시각 등)
        // 여기서는 ID를 기준으로 다음 시작 인덱스를 찾음
        const foundIndex = allReplies.findIndex(
          (r) => r.commentId === nextCursorId
        );
        // 주의: 실제 API는 보통 '이 ID 다음부터'의 개념이지만, 목업에서는 '이 ID부터'로 단순화 할 수 있음
        // 여기서는 찾은 인덱스 다음부터 가져오는 것으로 가정 (찾지 못하면 0부터)
        startIndex = foundIndex !== -1 ? foundIndex + 1 : allReplies.length; // 못 찾으면 빈 배열 반환하도록
      }

      const repliesToSend = allReplies.slice(startIndex, startIndex + limit);
      const nextCursor =
        startIndex + limit < allReplies.length
          ? allReplies[startIndex + limit].commentId
          : null;

      console.log(
        `[Mock API] Returning ${repliesToSend.length} replies for parent ${commentId}, nextCursor: ${nextCursor}`
      );
      // API 응답 형식에 맞춰 반환
      setTimeout(
        () =>
          resolve({
            data: { replies: repliesToSend, nextCursorId: nextCursor },
          }),
        300
      ); // 딜레이 시뮬레이션
    });
  },

  /**
   * [수정] 댓글 또는 대댓글 생성
   * @param postId 댓글/대댓글이 속한 게시글 ID
   * @param content 댓글/대댓글 내용
   * @param parentCommentId 부모 댓글 ID (대댓글일 경우), 없으면 최상위 댓글
   */
  // 댓글 생성
  createComment: (
    postId: number,
    content: string,
    parentCommentId?: number
  ): Promise<{ data: { commentId: number; profileUrl?: string | null } }> => {
    // API 명세서 응답 참고
    return new Promise((resolve, reject) => {
      console.log(
        `[Mock API] createComment called: postId=${postId}, parentId=${parentCommentId}, content=${content}`
      );
      const post = mockPosts.find((p) => p.postId === postId);

      if (!post) {
        console.error(
          `[Mock API] Post ${postId} not found for creating comment.`
        );
        return setTimeout(
          () => reject({ message: "게시글을 찾을 수 없습니다." }),
          300
        );
      }

      // --- 새 commentId 생성 (모든 댓글/대댓글 ID 고려) ---
      const allCommentIds = mockPosts.flatMap((p) =>
        p.comments.map((c) => c.commentId)
      );
      const allReplyIds = Object.values(mockAllReplies)
        .flat()
        .map((r) => r.commentId);
      const maxId = Math.max(0, ...allCommentIds, ...allReplyIds);
      const newCommentId = maxId + 1;
      // profileUrl이 undefined, null, "" 일 수 있음을 명시적으로 처리
      const profileUrlValue = currentUser.profileUrl || "";
      // ----------------------------------------------------

      if (parentCommentId) {
        // --- 대댓글 처리 ---
        // 대댓글 객체 생성
        const newReplyData: Reply = {
          // Reply 타입 사용
          commentId: newCommentId,
          parentId: parentCommentId, // 필수
          nickname: currentUser.nickname,
          profileUrl: profileUrlValue, // 빈 문자열을 포함한 string
          userType: currentUser.userType,
          createdAt: new Date().toISOString(),
          content: content,
          likeCount: 0,
          isLiked: false,
        };
        let parentFoundInPost = false;
        // 1. mockPosts 내 부모 댓글 찾아서 replies 배열 및 replyCount 업데이트
        for (const p of mockPosts) {
          const parentComment: Comment | undefined = p.comments.find(
            (c) => c.commentId === parentCommentId
          );
          if (parentComment) {
            if (!parentComment.replies) {
              // replies 배열 없으면 생성
              parentComment.replies = [] as Reply[];
            }
            // 초기 로드 개수 제한 로직은 getPostDetail 에서 처리하므로 여기선 그냥 추가
            parentComment.replies.push(newReplyData);
            parentComment.replyCount += 1; // 부모의 대댓글 수 증가
            parentFoundInPost = true;
            console.log(
              `[Mock API] Reply ${newCommentId} added to parent comment ${parentCommentId} in mockPosts.`
            );
            break;
          }
          // TODO: 만약 대댓글의 대댓글(2단계 이상)을 허용한다면 재귀적으로 찾아야 함 (현재는 1단계만 가정)
        }

        // 2. mockAllReplies 업데이트 (더보기용 데이터)
        if (!mockAllReplies[parentCommentId]) {
          mockAllReplies[parentCommentId] = [] as Reply[];
        }
        mockAllReplies[parentCommentId].push(newReplyData);
        console.log(
          `[Mock API] Reply ${newCommentId} added to mockAllReplies[${parentCommentId}].`
        );

        if (!parentFoundInPost) {
          console.warn(
            `[Mock API] Parent comment ${parentCommentId} not found within currently loaded mockPosts' comments.`
          );
          // 이 경우 mockAllReplies에는 추가되었으므로 '더보기' 시 보일 수 있음
        }
      } else {
        // 새 댓글/대댓글 객체 생성
        const newCommentData: Comment = {
          commentId: newCommentId,
          parentId: undefined,
          nickname: currentUser.nickname,
          profileUrl: profileUrlValue, // 빈 문자열을 포함한 string
          userType: currentUser.userType,
          createdAt: new Date().toISOString(),
          content: content,
          likeCount: 0,
          isLiked: false,
          replyCount: 0, // 새 댓글/대댓글은 replyCount 0
          replies: [], // 초기 replies는 빈 배열
          // userId: currentUser.id // userId 사용 시
        };
        // --- 최상위 댓글 처리 (기존 로직) ---
        post.comments.push(newCommentData);
        post.commentCount += 1; // 게시글의 댓글 수 증가
        console.log(
          `[Mock API] Top-level comment ${newCommentId} added to post ${postId}.`
        );
      }

      // API 명세에 따른 응답 반환
      setTimeout(
        () =>
          resolve({
            data: {
              commentId: newCommentId,
              profileUrl: profileUrlValue,
            },
          }),
        300
      );
    });
  },
  /**
   * [수정] 댓글 또는 대댓글 수정
   * @param commentId 수정할 댓글/대댓글 ID
   * @param content 수정할 내용
   */
  updateComment: (commentId: number, content: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log(
        `[Mock API] updateComment called: commentId=${commentId}, content=${content}`
      );
      let found = false;
      let itemUpdated: Comment | Reply | undefined; // 업데이트된 아이템 저장용
      for (const post of mockPosts) {
        // 1. 최상위 댓글에서 검색 및 업데이트
        const commentIndex = post.comments.findIndex(
          (c) => c.commentId === commentId
        );
        if (commentIndex !== -1) {
          console.log(
            `[Mock API] Found comment ${commentId} in post ${post.postId}, updating content.`
          );
          post.comments[commentIndex].content = content;
          itemUpdated = post.comments[commentIndex]; // 업데이트된 객체 저장
          found = true;
          break;
        }

        // 2. 대댓글(replies)에서 검색
        for (const parent of post.comments) {
          if (parent.replies) {
            const replyIndex = parent.replies.findIndex(
              (r) => r.commentId === commentId
            );
            if (replyIndex !== -1) {
              console.log(
                `[Mock API] Found reply ${commentId} under parent ${parent.commentId} in post ${post.postId}, updating content.`
              );
              parent.replies[replyIndex].content = content;
              itemUpdated = parent.replies[replyIndex]; // 업데이트된 객체 저장
              found = true;
              break;
            }
          }
        }
        if (found) break; // 외부 루프 종료
      }

      // 3. mockAllReplies 에서도 업데이트 (데이터 일관성 유지)
      if (
        found &&
        itemUpdated &&
        "parentId" in itemUpdated &&
        itemUpdated.parentId
      ) {
        // itemUpdated가 Reply 타입인지 확인 (parentId 유무로)
        const parentId = itemUpdated.parentId;
        if (mockAllReplies[parentId]) {
          const replyIndexInAll = mockAllReplies[parentId].findIndex(
            (r) => r.commentId === commentId
          );
          if (replyIndexInAll !== -1) {
            mockAllReplies[parentId][replyIndexInAll].content = content;
            console.log(
              `[Mock API] Also updated reply ${commentId} in mockAllReplies[${parentId}].`
            );
          }
        }
      }

      if (found) {
        console.log(
          `[Mock API] Comment/Reply ${commentId} updated successfully.`
        );
        setTimeout(() => resolve(), 300);
      } else {
        console.error(
          `[Mock API] Comment/Reply ${commentId} not found for update.`
        );
        setTimeout(() => reject({ message: "댓글을 찾을 수 없습니다." }), 300);
      }
    });
  },

  /**
   * [수정] 댓글 또는 대댓글 삭제
   * @param commentId 삭제할 댓글/대댓글 ID
   */
  deleteComment: (commentId: number): Promise<void> => {
    // 성공 시 void 반환 가정
    return new Promise((resolve, reject) => {
      console.log(`[Mock API] deleteComment called: commentId=${commentId}`);
      let found = false;
      let parentIdToUpdate: number | undefined = undefined; // 대댓글 삭제 시 부모 ID 저장

      for (let i = 0; i < mockPosts.length; i++) {
        const post = mockPosts[i];
        // 1. 최상위 댓글에서 검색 및 삭제
        const commentIndex = post.comments.findIndex(
          (c) => c.commentId === commentId
        );
        if (commentIndex !== -1) {
          const deletedComment = post.comments.splice(commentIndex, 1)[0];
          post.commentCount -= 1; // 게시글 댓글 수 감소
          // 해당 댓글의 모든 대댓글도 mockAllReplies에서 삭제 (선택적 - 요구사항에 따라 다름)
          if (mockAllReplies[deletedComment.commentId]) {
            delete mockAllReplies[deletedComment.commentId];
            console.log(
              `[Mock API] Also deleted replies for comment ${deletedComment.commentId} from mockAllReplies.`
            );
          }
          found = true;
          console.log(
            `[Mock API] Deleted comment ${commentId} from post ${post.postId}.`
          );
          break;
        }

        // 2. 대댓글에서 검색 및 삭제
        for (let j = 0; j < post.comments.length; j++) {
          const parent = post.comments[j];
          if (parent.replies) {
            const replyIndex = parent.replies.findIndex(
              (r) => r.commentId === commentId
            );
            if (replyIndex !== -1) {
              parent.replies.splice(replyIndex, 1); // replies 배열에서 제거
              parent.replyCount -= 1; // 부모 댓글의 replyCount 감소
              parentIdToUpdate = parent.commentId; // 부모 ID 저장 (mockAllReplies 업데이트용)
              found = true;
              console.log(
                `[Mock API] Deleted reply ${commentId} from parent ${parent.commentId} in mockPosts.`
              );
              break;
            }
          }
        }
        if (found) break;
      }

      // 3. mockAllReplies 에서도 삭제 (데이터 일관성 유지)
      if (found && parentIdToUpdate !== undefined) {
        if (mockAllReplies[parentIdToUpdate]) {
          const replyIndexInAll = mockAllReplies[parentIdToUpdate].findIndex(
            (r) => r.commentId === commentId
          );
          if (replyIndexInAll !== -1) {
            mockAllReplies[parentIdToUpdate].splice(replyIndexInAll, 1);
            console.log(
              `[Mock API] Also deleted reply ${commentId} from mockAllReplies[${parentIdToUpdate}].`
            );
          }
        }
      }

      if (found) {
        console.log(
          `[Mock API] Comment/Reply ${commentId} deleted successfully.`
        );
        setTimeout(() => resolve(), 300);
      } else {
        console.error(
          `[Mock API] Comment/Reply ${commentId} not found for deletion.`
        );
        setTimeout(() => reject({ message: "댓글을 찾을 수 없습니다." }), 300);
      }
    });
  },
}; // End of MockBoardAPI object
