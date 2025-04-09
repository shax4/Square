/**
 * 게시글 목록 조회를 위한 커스텀 훅
 * 최신순 또는 좋아요순으로 게시글 목록을 불러오고 무한 스크롤을 지원합니다.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { PostService } from "../services/postService";
import {
  Post,
  PopularPost,
  GetPostsParams,
  PostListResponse,
} from "../types/postTypes";

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false); // 초기값 false 유지
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [nextCursorId, setNextCursorId] = useState<number | undefined>(
    undefined
  );
  const [nextCursorLikes, setNextCursorLikes] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"latest" | "likes">(
    initialParams.sort || "latest"
  );
  const [refreshing, setRefreshing] = useState(false);

  // API 호출 추적을 위한 참조
  const apiCallInProgressRef = useRef(false);
  const isFirstLoadRef = useRef(true); // 초기 로드 상태를 ref로 관리
  const latestApiCallTimestampRef = useRef<number>(0); // 마지막 API 호출 시간 추적

  // 값들을 ref로 관리하여 렌더링 사이에 안정적으로 유지
  const paramsRef = useRef(initialParams);
  const sortByRef = useRef(sortBy); // sortBy 상태를 ref로도 관리
  const nextCursorIdRef = useRef(nextCursorId);
  const nextCursorLikesRef = useRef(nextCursorLikes);

  // 정렬 변경 감지용 ref - 컴포넌트 최상위 레벨로 이동
  const sortChangeFirstRenderRef = useRef(true);

  // 마운트 여부 추적 ref 추가
  const isMountedRef = useRef(false);

  // ref 값 업데이트를 위한 useEffect
  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);

  useEffect(() => {
    nextCursorIdRef.current = nextCursorId;
  }, [nextCursorId]);

  useEffect(() => {
    nextCursorLikesRef.current = nextCursorLikes;
  }, [nextCursorLikes]);

  // 게시글 목록 로드 함수 - 의존성 제거하고 ref를 통해 최신 상태에 접근
  const loadPosts = useCallback(async () => {
    // 이미 언마운트된 경우 중단
    if (!isMountedRef.current) {
      console.log("컴포넌트 언마운트됨, 상태 업데이트 중단");
      return Promise.resolve();
    }

    // 이미 API 호출 중이라면 중복 호출 방지
    if (apiCallInProgressRef.current) {
      console.log("이미 API 호출이 진행 중입니다.");
      return Promise.resolve();
    }

    // 마지막 API 호출로부터 500ms 이내라면 중복 호출 방지
    const now = Date.now();
    if (now - latestApiCallTimestampRef.current < 500) {
      console.log("API 호출 간격이 너무 짧습니다. 호출 무시.");
      return Promise.resolve();
    }

    // API 호출 상태 및 로딩 상태 설정
    apiCallInProgressRef.current = true;
    latestApiCallTimestampRef.current = now; // 현재 시간 기록
    setLoading(true); // 로딩 시작
    setError(null); // 이전 에러 초기화

    try {
      // API 요청 파라미터 구성 (ref에서 값 가져오기)
      const params: GetPostsParams = {
        sort: sortByRef.current,
        limit: paramsRef.current.limit,
      };

      // 페이지네이션 커서 추가 (첫 로드가 아닐 경우만)
      if (!isFirstLoadRef.current) {
        if (
          sortByRef.current === "latest" &&
          nextCursorIdRef.current !== undefined
        ) {
          params.nextCursorId = nextCursorIdRef.current;
        } else if (
          sortByRef.current === "likes" &&
          nextCursorLikesRef.current !== null
        ) {
          params.nextCursorLikes = nextCursorLikesRef.current;
        }
      }

      console.log("API 호출 시작, 파라미터:", params);

      // API 호출: PostService.getPosts는 PostListResponse | undefined 를 반환
      const responseData: PostListResponse | undefined =
        await PostService.getPosts(params); // responseData 변수에 직접 할당

      // 마운트 상태 확인
      if (!isMountedRef.current) {
        console.log("컴포넌트 언마운트됨, 상태 업데이트 중단");
        return;
      }

      // *** 가장 중요 수정: responseData 자체를 확인 ***
      if (responseData) {
        // responseData가 존재하고 유효한 경우 (null, undefined 아님)

        // 상세한 응답 데이터 로깅 (이미 responseData 변수에 할당됨)
        console.log(
          "✅ API 응답 데이터 처리 시작:",
          `posts: ${responseData.posts?.length || 0}개, popularPosts: ${
            responseData.popularPosts?.length ||
            responseData.popular?.length ||
            0
          }개`
        );

        // 사용자 유형 상태 업데이트
        if (responseData.userType !== undefined) {
          setUserType(responseData.userType);
          console.log(`👤 사용자 유형 업데이트: ${responseData.userType}`);
        }

        // 첫 로드 또는 새로고침 시 상태 업데이트
        if (isFirstLoadRef.current || posts.length === 0) {
          console.log("🚀 첫 로드 또는 새로고침: 상태 업데이트 시도");

          // 인기 게시글 상태 업데이트 ('popularPosts' 또는 'popular' 확인)
          const popularData = responseData.popularPosts || responseData.popular;
          if (popularData && Array.isArray(popularData)) {
            console.log(
              `✨ 인기 게시글 (${popularData.length}개) 상태 업데이트:`
            );
            setPopularPosts(popularData);
          } else {
            console.log("⚠️ 인기 게시글 데이터 없음 또는 형식이 배열이 아님.");
            setPopularPosts([]);
          }

          // 일반 게시글 상태 업데이트
          if (responseData.posts && Array.isArray(responseData.posts)) {
            console.log(
              `📄 일반 게시글 (${responseData.posts.length}개) 상태 업데이트:`
            );
            setPosts(responseData.posts);
          } else {
            console.log("⚠️ 일반 게시글 데이터 없음 또는 형식이 배열이 아님.");
            setPosts([]);
          }

          isFirstLoadRef.current = false;
        } else {
          // 추가 로드 (무한 스크롤)
          console.log("⏬ 추가 로드: 기존 게시글에 새 게시글 추가 시도");
          if (responseData.posts && Array.isArray(responseData.posts)) {
            console.log(`➡️ 새 게시글 ${responseData.posts.length}개 추가`);
            setPosts((prevPosts) => [...prevPosts, ...responseData.posts]);
          } else {
            console.log("⚠️ 추가 로드할 게시글 데이터 없음.");
          }
        }

        // 다음 페이지 커서 정보 업데이트
        setNextCursorId(responseData.nextCursorId);
        setNextCursorLikes(responseData.nextCursorLikes || null);

        // 더 불러올 데이터 있는지 여부 업데이트
        const hasMoreData =
          sortByRef.current === "latest"
            ? !!responseData.nextCursorId
            : responseData.nextCursorLikes !== undefined &&
              responseData.nextCursorLikes !== null;
        setHasMore(hasMoreData);
        console.log(`🔍 더 불러올 게시글: ${hasMoreData ? "있음" : "없음"}`);
      } else {
        // API 호출은 성공했으나 응답 데이터가 없는 경우 (responseData가 undefined)
        console.log(
          "⚠️ API 응답에 유효한 데이터가 없습니다. (responseData is undefined/null)"
        );
        // 빈 목록으로 처리
        setPosts([]);
        setPopularPosts([]);
        setHasMore(false); // 더 이상 로드할 데이터 없음
      }
    } catch (err) {
      // API 호출 자체에서 에러 발생 시
      if (!isMountedRef.current) return;
      console.error("❌ 게시글 목록 로드 중 에러 발생:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("게시글 목록 로딩 중 알 수 없는 오류가 발생했습니다.")
      );
      setHasMore(false); // 에러 발생 시 추가 로드 중단
      // 에러 시 데이터 초기화
      setPosts([]);
      setPopularPosts([]);
    } finally {
      // 로딩 상태 종료 및 API 호출 상태 해제
      if (isMountedRef.current) {
        setLoading(false);
        console.log("🏁 로딩 상태 종료");
      }
      apiCallInProgressRef.current = false;
    }
  }, []); // 의존성 배열 비움

  // 초기 데이터 로드 (컴포넌트 마운트 시 1회만 실행)
  useEffect(() => {
    console.log("컴포넌트 마운트: 초기 데이터 로드");
    // 마운트 상태 설정
    isMountedRef.current = true;

    // initialParams 업데이트 (ref로 관리)
    paramsRef.current = initialParams;
    sortByRef.current = initialParams.sort || "latest";
    setSortBy(initialParams.sort || "latest");

    // 첫 로드 표시 설정
    isFirstLoadRef.current = true;

    // 약간의 지연 후 최초 데이터 로드
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        loadPosts();
      }
    }, 0);

    // cleanup 함수에서 모든 상태 초기화
    return () => {
      clearTimeout(timer);
      isMountedRef.current = false;
      isFirstLoadRef.current = true;
      apiCallInProgressRef.current = false;
      console.log("컴포넌트 언마운트: 타이머 및 상태 정리");
    };
  }, []); // 의존성 배열 비움 - loadPosts는 메모이제이션되어 안정적임

  // 정렬 방식 변경 시 데이터 다시 로드
  useEffect(() => {
    // 첫 렌더링은 무시 - 이제 최상위 레벨의 ref를 사용
    if (sortChangeFirstRenderRef.current) {
      sortChangeFirstRenderRef.current = false;
      return;
    }

    // 마운트 상태 확인
    if (!isMountedRef.current) return;

    // 정렬 변경 시 상태 초기화 및 데이터 다시 로드
    console.log("정렬 방식 변경됨:", sortBy);
    setPosts([]); // 기존 게시글 초기화
    setPopularPosts([]); // 기존 인기 게시글 초기화
    setNextCursorId(undefined); // 커서 초기화
    setNextCursorLikes(null); // 커서 초기화
    setHasMore(true); // 더 불러올 데이터 있음으로 초기화
    isFirstLoadRef.current = true; // 정렬 변경 시 첫 로드로 간주

    // 약간의 지연 후 로드 (상태 업데이트 완료 후)
    const timer = setTimeout(() => {
      if (isMountedRef.current && !apiCallInProgressRef.current) {
        console.log("정렬 변경 후 데이터 로드 호출");
        loadPosts();
      }
    }, 100); // 지연 시간 추가하여 상태 업데이트 반영 시간 확보

    return () => clearTimeout(timer);
  }, [sortBy]); // sortBy 변경 시에만 실행

  // initialParams 변경 감지 (외부에서 파라미터가 변경될 경우)
  useEffect(() => {
    // 마운트 이후 및 첫 로드 이후에만 처리
    if (!isMountedRef.current || isFirstLoadRef.current) return;

    // initialParams 변경 시 ref 업데이트
    paramsRef.current = initialParams;

    // 외부에서 정렬 방식이 변경된 경우, 내부 상태 업데이트 및 데이터 재로드 트리거
    if (initialParams.sort && initialParams.sort !== sortByRef.current) {
      console.log("외부 파라미터 변경 감지 - 정렬 변경:", initialParams.sort);
      changeSort(initialParams.sort); // changeSort 함수를 통해 상태 변경 및 재로드 유도
    }
  }, [initialParams]); // initialParams 객체 참조 변경 시 실행

  // 정렬 방식 변경 함수
  const changeSort = useCallback(
    (newSort: "latest" | "likes") => {
      // 현재 정렬 방식과 같으면 아무 작업 안 함
      if (sortByRef.current === newSort) return;
      console.log("정렬 방식 변경 요청:", newSort);
      // 내부 상태 및 ref 업데이트
      setSortBy(newSort);
      sortByRef.current = newSort;
      // 정렬 변경 useEffect가 트리거되어 데이터 재로드 실행됨
    },
    [] // 의존성 없음
  );

  /**
   * 추가 게시글을 불러오는 함수 (무한 스크롤)
   */
  const loadMore = useCallback(async () => {
    // 마운트 상태, 더 불러올 데이터 유무, 로딩 상태 확인
    if (
      !isMountedRef.current ||
      !hasMore ||
      loading ||
      apiCallInProgressRef.current
    ) {
      if (!hasMore) console.log("더 이상 불러올 게시글이 없습니다.");
      return;
    }
    console.log("스크롤 끝 도달: 추가 데이터 로드 시도");
    await loadPosts(); // 게시글 로드 함수 호출
  }, [hasMore, loading]); // hasMore, loading 상태 변경 시 함수 재생성

  /**
   * 목록 새로고침 함수 (Pull-to-refresh)
   */
  const refresh = useCallback(async () => {
    // 마운트 상태, 새로고침 진행 상태 확인
    if (!isMountedRef.current || refreshing || apiCallInProgressRef.current) {
      return;
    }

    console.log("새로고침 시작");
    setRefreshing(true); // 새로고침 UI 표시
    setPosts([]); // 상태 초기화
    setPopularPosts([]);
    setNextCursorId(undefined);
    setNextCursorLikes(null);
    setHasMore(true);
    isFirstLoadRef.current = true; // 새로고침 시 첫 로드로 간주

    try {
      await loadPosts(); // 데이터 다시 로드
    } finally {
      if (isMountedRef.current) {
        setRefreshing(false); // 새로고침 UI 숨김
      }
      console.log("새로고침 완료");
    }
  }, [refreshing]); // refreshing 상태 변경 시 함수 재생성

  // 훅의 반환값
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
