/**
 * 게시글 목록 조회를 위한 커스텀 훅
 * 최신순 또는 좋아요순으로 게시글 목록을 불러오고 무한 스크롤을 지원합니다.
 */

import { useState, useEffect, useCallback } from "react";
import { PostService } from "../services";
import { Post, PopularPost, GetPostsParams } from "../types/postTypes";

// 훅의 반환 타입 정의
export interface UsePostListReturn {
  posts: Post[]; // 게시글 목록
  popularPosts: PopularPost[]; // 인기 게시글 목록
  loading: boolean; // 로딩 상태
  error: Error | null; // 에러 상태
  hasMore: boolean; // 더 불러올 게시글이 있는지 여부
  loadMore: () => Promise<void>; // 추가 게시글 로드 함수
  refresh: () => Promise<void>; // 목록 새로고침 함수
  userType: string | null; // 사용자 유형 (필터링 정보)
  refreshing: boolean; // 새로고침 중인지 상태 (ui)
  changeSort: (sort: "latest" | "likes") => void; // 정렬 방식 변경 함수
}

/**
 * 게시글 목록 조회 커스텀 훅
 * @param initialParams 초기 조회 파라미터 (정렬 방식, 제한 수 등)
 * @returns 게시글 목록 관련 상태와 함수들
 */
export const usePostList = (
  initialParams: GetPostsParams = { sort: "latest", limit: 10 }
): UsePostListReturn => {
  // 상태 관리
  const [posts, setPosts] = useState<Post[]>([]); // 게시글 목록
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]); // 인기 게시글 목록
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태
  const [error, setError] = useState<Error | null>(null); // 에러 상태
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 불러올 게시글이 있는지 여부
  const [userType, setUserType] = useState<string | null>(null); // 사용자 유형

  // 커서 상태 관리 (무한 스크롤용)
  const [nextCursorId, setNextCursorId] = useState<number | undefined>(
    undefined
  );
  const [nextCursorLikes, setNextCursorLikes] = useState<number | null>(null);

  // 현재 정렬 방식 상태
  const [sortBy, setSortBy] = useState<"latest" | "likes">(
    initialParams.sort || "latest"
  );

  // 새로고침 상태 추가
  const [refreshing, setRefreshing] = useState(false);

  /**
   * 게시글 목록을 불러오는 함수
   * 초기 로딩 또는 새로고침 시 사용
   */
  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await PostService.getPosts({
        sort: sortBy,
        limit: initialParams.limit,
      });

      // 응답 데이터 처리
      if (response.data) {
        setPosts(response.data.posts);
        setPopularPosts(response.data.popular);
        setUserType(response.data.userType);

        // 다음 페이지 커서 설정
        if (response.data.nextCursorId !== undefined) {
          setNextCursorId(response.data.nextCursorId);
        }
        setNextCursorLikes(response.data.nextCursorLikes || null);

        // 더 불러올 데이터가 있는지 확인
        setHasMore(
          !!response.data.nextCursorId || !!response.data.nextCursorLikes
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("게시글 목록을 불러오는 중 오류가 발생했습니다.")
      );
      console.error("게시글 목록 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [sortBy, initialParams.limit]);

  /**
   * 추가 게시글을 불러오는 함수
   * 무한 스크롤에서 사용
   */
  const loadMore = useCallback(async () => {
    // 더 불러올 게시글이 없거나 이미 로딩 중이면 중단
    if (!hasMore || loading) return;

    setLoading(true);

    try {
      // 정렬 방식에 따라 적절한 커서와 요청 파라미터 구성
      let params: GetPostsParams = {
        sort: sortBy,
        limit: initialParams.limit,
      };

      // 정렬 방식에 따라 적절한 커서 파라미터 추가
      if (sortBy === "latest" && nextCursorId !== undefined) {
        params.nextCursorId = nextCursorId;
      } else if (sortBy === "likes" && nextCursorLikes !== null) {
        params.nextCursorLikes = nextCursorLikes;
      }

      // API 호출
      const response = await PostService.getPosts(params);

      // 응답 데이터 처리
      if (response && response.data) {
        const {
          posts: newPosts,
          nextCursorId,
          nextCursorLikes,
        } = response.data;

        // 기존 목록에 새 게시글 추가
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);

        // 다음 페이지 커서 업데이트
        if (nextCursorId !== undefined) {
          setNextCursorId(nextCursorId);
        }
        setNextCursorLikes(nextCursorLikes || null);

        // 더 불러올 데이터가 있는지 확인
        setHasMore(!!nextCursorId || !!nextCursorLikes);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("추가 게시글을 불러오는 중 오류가 발생했습니다.")
      );
      console.error("추가 게시글 로딩 오류:", err);
    } finally {
      setLoading(false);
    }
  }, [
    hasMore,
    loading,
    sortBy,
    nextCursorId,
    nextCursorLikes,
    initialParams.limit,
  ]);

  /**
   * 목록 새로고침 함수
   */
  const refresh = useCallback(async () => {
    setPosts([]);
    setNextCursorId(undefined);
    setNextCursorLikes(null);
    setHasMore(true);
    setRefreshing(true);

    try {
      await loadPosts();
    } finally {
      setRefreshing(false);
    }
  }, [loadPosts]);

  // 정렬 방식이 변경되면 목록 초기화 후 다시 로드
  useEffect(() => {
    setPosts([]);
    setNextCursorId(undefined);
    setNextCursorLikes(null);
    setHasMore(true);
    loadPosts();
  }, [sortBy, loadPosts]);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // 정렬 방식 변경 함수
  const changeSort = useCallback(
    (newSort: "latest" | "likes") => {
      if (newSort !== sortBy) {
        setSortBy(newSort);
      }
    },
    [sortBy]
  );

  return {
    posts,
    popularPosts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    userType,
    refreshing,
    changeSort,
  };
};

export default usePostList;
