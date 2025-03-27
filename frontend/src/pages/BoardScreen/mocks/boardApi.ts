import { mockPosts, mockPopularPosts, currentUser } from './boardData';

export const MockBoardAPI = {
  // 게시글 목록 조회
  getPosts: (
    sort: 'latest' | 'likes' = 'latest',
    nextCursorId: number | null = null,
    nextCursorLikes: number | null = null,
    limit: number = 10
  ) => {
    // 정렬 방식에 따라 게시글 정렬
    let sortedPosts = [...mockPosts];
    if (sort === 'likes') {
      sortedPosts.sort((a, b) => b.likeCount - a.likeCount);
    } else {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    // 커서 기반 페이지네이션 구현 (간단한 구현)
    if (nextCursorId) {
      sortedPosts = sortedPosts.filter(post => post.postId < nextCursorId);
    }
    
    // 데이터 크기 제한
    const posts = sortedPosts.slice(0, limit);
    
    // API 응답 형식에 맞춰 데이터 반환
    return Promise.resolve({
      data: {
        userType: currentUser.userType,
        popular: mockPopularPosts,
        posts,
        nextCursorId: posts.length > 0 ? posts[posts.length - 1].postId - 1 : null,
        nextCursorLikes: null
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 게시글 상세 조회
  getPostDetail: (postId: number) => {
    const post = mockPosts.find(p => p.postId === postId);
    
    if (!post) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: '게시글을 찾을 수 없습니다.' }
        }
      });
    }
    
    return Promise.resolve({
      data: post,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 게시글 생성
  createPost: (data: { title: string, content: string }) => {
    const newPost = {
      postId: Math.max(...mockPosts.map(p => p.postId)) + 1,
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
      comments: []
    };
    
    mockPosts.unshift(newPost); // 새 게시글을 mockPosts 배열의 최상단에 추가
    
    return Promise.resolve({
      data: newPost,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 게시글 수정
  updatePost: (postId: number, data: { title: string, content: string }) => {
    const postIndex = mockPosts.findIndex(p => p.postId === postId);
    
    if (postIndex === -1) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: '게시글을 찾을 수 없습니다.' }
        }
      });
    }
    
    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      title: data.title,
      content: data.content
    };
    
    return Promise.resolve({
      data: mockPosts[postIndex],
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 게시글 삭제
  deletePost: (postId: number) => {
    const postIndex = mockPosts.findIndex(p => p.postId === postId);
    
    if (postIndex === -1) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: '게시글을 찾을 수 없습니다.' }
        }
      });
    }
    
    mockPosts.splice(postIndex, 1);
    
    return Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 댓글 생성
  createComment: (postId: number, content: string) => {
    const post = mockPosts.find(p => p.postId === postId);
    
    if (!post) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: '게시글을 찾을 수 없습니다.' }
        }
      });
    }
    
    const newCommentId = Math.max(...mockPosts.flatMap(p => p.comments.map(c => c.commentId))) + 1;
    
    const newComment = {
      commentId: newCommentId,
      nickname: currentUser.nickname,
      profileUrl: currentUser.profileUrl,
      userType: currentUser.userType,
      createdAt: new Date().toISOString(),
      content,
      likeCount: 0,
      isLiked: false,
      replyCount: 0,
      replies: []
    };
    
    post.comments.push(newComment);
    post.commentCount += 1;
    
    return Promise.resolve({
      data: newComment,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  },
  
  // 댓글 삭제
  deleteComment: (commentId: number) => {
    let found = false;
    
    for (const post of mockPosts) {
      const commentIndex = post.comments.findIndex(c => c.commentId === commentId);
      
      if (commentIndex !== -1) {
        post.comments.splice(commentIndex, 1); // 댓글 제거
        post.commentCount -= 1; // 댓글 수 감소
        found = true;
        break;
      }
    }
    
    if (!found) {
      return Promise.reject({
        response: {
          status: 404,
          statusText: 'Not Found',
          data: { message: '댓글을 찾을 수 없습니다.' }
        }
      });
    }
    
    return Promise.resolve({
      data: {},
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    });
  }
};
