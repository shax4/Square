import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";
import Text from "../../components/Common/Text";
import colors from "../../../assets/colors";
import BoardItem from "./components/BoardItem";
import EmptyBoardList from "./components/EmptyBoardList";
import PopularPostCard from "./components/PopularPostCard";
import { usePostList } from "../../shared/hooks/usePostList";
import { Post } from "../../shared/types/postTypes";
import { PostService } from "../../shared/services/postService";
import { Icons } from "../../../assets/icons/Icons";
import { useAuthStore } from "../../shared/stores/auth";

// 네비게이션 프롭 타입 정의
type BoardListScreenNavigationProp = StackNavigationProp<
  BoardStackParamList,
  "BoardList"
>;

// props 타입 정의
interface BoardListScreenProps {
  navigation: BoardListScreenNavigationProp;
  route: RouteProp<BoardStackParamList, "BoardList">;
}

/**
 * 게시글 목록 화면 컴포넌트
 * 게시글 목록을 표시하고 무한 스크롤, 정렬, 새로고침 기능을 제공합니다.
 */
export default function BoardListScreen({
  route,
  navigation,
}: BoardListScreenProps) {
  // 1. 모든 useState 훅 호출
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest");
  const [loadingStartTime, setLoadingStartTime] = useState(Date.now());

  // 로그인 상태 확인
  const { loggedIn, user } = useAuthStore();

  // 컴포넌트 마운트 시 로그인 상태 및 토큰 확인
  useEffect(() => {
    console.log("🔐 로그인 상태:", loggedIn ? "로그인됨" : "로그인되지 않음");
    console.log("👤 사용자 정보:", user ? `닉네임: ${user.nickname}` : "없음");

    if (!loggedIn || !user) {
      console.log("⚠️ 로그인이 필요합니다.");
    }
  }, [loggedIn, user]);

  // 2. 모든 useRef 훅 호출
  const isInitialMount = useRef(true);
  const flatListRef = useRef<FlatList>(null);

  // 3. usePostList 파라미터를 useMemo로 메모이제이션
  const postListParams = useMemo(
    () => ({
      sort: sortBy,
      limit: 10,
    }),
    [sortBy]
  ); // sortBy만 의존성으로 포함 - limit은 변경되지 않음

  // 4. usePostList 커스텀 훅 호출 - 메모이제이션된 파라미터 전달
  const {
    posts,
    popularPosts,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    refreshing,
    changeSort,
  } = usePostList(postListParams);

  // 5. 로딩 시작 시간 관리를 위한 useEffect
  useEffect(() => {
    if (loading) {
      setLoadingStartTime(Date.now());
    }
  }, [loading]);

  // 6. 라우트 파라미터 변경 감지를 위한 useFocusEffect
  useFocusEffect(
    useCallback(() => {
      // 화면에 포커스가 올 때마다 실행
      if (route.params?.refresh && !isInitialMount.current) {
        refresh();
        // 파라미터 초기화
        navigation.setParams({ refresh: undefined });
      }
      // 첫 마운트 표시 해제
      isInitialMount.current = false;

      // 컴포넌트 언마운트 시 정리 작업
      return () => {};
    }, [route.params?.refresh, refresh, navigation])
  );

  // 7. 정렬 변경 핸들러 함수
  const handleSortChange = useCallback(
    (newSort: "latest" | "likes") => {
      if (sortBy !== newSort) {
        setSortBy(newSort);
        changeSort(newSort);
      }
    },
    [sortBy, changeSort]
  );

  // 8. 날짜 포맷팅 함수
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }, []);

  // 9. 게시글 아이템 렌더링 함수
  const renderItem = useCallback(
    ({ item }: { item: Post }) => {
      // 각 아이템 렌더링 시 로그 (필요하면 주석 해제하여 사용)
      // console.log("Rendering post item:", item.postId, item.title);
      return (
        <BoardItem
          item={{ ...item, userType: item.userType || "" }}
          onPress={() =>
            navigation.navigate("BoardDetail", { boardId: item.postId })
          }
        />
      );
    },
    [navigation]
  );

  // 10. 무한 스크롤 처리 함수
  const handleEndReached = useCallback(() => {
    if (hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // 11. 새로고침 핸들러 - 메모이제이션
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // 12. 로딩 상태 컴포넌트 - JSX를 변수로 분리하여 조건부 렌더링 안전하게 구현
  const LoadingComponent = useMemo(
    () => (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
      </View>
    ),
    []
  );

  // 13. 로딩 시간 초과 컴포넌트
  const LoadingTimeoutComponent = useMemo(
    () => (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          게시글을 불러오는데 시간이 오래 걸립니다.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    ),
    [handleRefresh]
  );

  // 14. 에러 상태 컴포넌트
  const ErrorComponent = useMemo(
    () => (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류가 발생했습니다.</Text>
        {error && <Text>{error.message}</Text>}
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    ),
    [error, handleRefresh]
  );

  // 15. 조건부 렌더링 - 초기 로딩 상태
  if (loading && Date.now() - loadingStartTime < 10000) {
    return LoadingComponent;
  }

  // 16. 조건부 렌더링 - 로딩 타임아웃
  if (loading && posts.length === 0) {
    return LoadingTimeoutComponent;
  }

  // 17. 조건부 렌더링 - 에러 상태
  if (error && posts.length === 0) {
    return ErrorComponent;
  }

  // 18. 메인 렌더링 - 게시글 목록 표시
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 로그인 상태 메시지 - 로그인하지 않았을 때만 표시 */}
        {!loggedIn && (
          <View style={styles.loginMessage}>
            <Text style={styles.loginMessageText}>
              게시판을 이용하려면 로그인이 필요합니다.
            </Text>
          </View>
        )}

        {/* 인기 게시글 섹션 */}
        {popularPosts.length > 0 && (
          <View style={styles.popularSection}>
            <Text style={styles.sectionTitle}>HOT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {popularPosts.map((post) => (
                <TouchableOpacity
                  key={post.postId}
                  onPress={() =>
                    navigation.navigate("BoardDetail", { boardId: post.postId })
                  }
                >
                  <View style={styles.popularPostItem}>
                    <Text numberOfLines={1} style={styles.popularPostTitle}>
                      {post.title}
                    </Text>
                    <Text style={styles.popularPostStats}>
                      좋아요 {post.likeCount} • 댓글 {post.commentCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 정렬 옵션 */}
        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "latest" && styles.activeSortButton,
            ]}
            onPress={() => handleSortChange("latest")}
          >
            <Text
              style={
                sortBy === "latest" ? styles.activeSortText : styles.sortText
              }
            >
              최신순
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "likes" && styles.activeSortButton,
            ]}
            onPress={() => handleSortChange("likes")}
          >
            <Text
              style={
                sortBy === "likes" ? styles.activeSortText : styles.sortText
              }
            >
              인기순
            </Text>
          </TouchableOpacity>
        </View>

        {/* 게시글 목록 */}
        <FlatList
          ref={flatListRef}
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => `post-${item.postId}`}
          contentContainerStyle={
            posts.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          ListEmptyComponent={!loading ? <EmptyBoardList /> : null}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && posts.length > 0 ? (
              <ActivityIndicator
                style={styles.footer}
                size="small"
                color="#999"
              />
            ) : !hasMore && posts.length > 0 ? (
              <Text style={styles.footer}>더 이상 게시글이 없습니다.</Text>
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />

        {/* 글쓰기 버튼 */}
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() =>
            navigation.navigate("BoardWrite", { postId: undefined })
          }
        >
          <Icons.write />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "600",
  },
  popularSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 14,
    color: colors.warnRed,
  },
  popularPostItem: {
    width: 160,
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  popularPostTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },
  popularPostStats: {
    fontSize: 11,
    color: colors.grayText,
  },
  sortOptions: {
    flexDirection: "row",
    padding: 18,
  },
  sortButton: {
    marginRight: 18,
    paddingVertical: 5,
  },
  activeSortButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007BFF",
  },
  sortText: {
    color: colors.grayText,
  },
  activeSortText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 80, // 글쓰기 버튼 영역 확보
  },
  emptyListContainer: {
    flex: 1, // 빈 목록일 때 화면 전체를 차지하도록 설정
    justifyContent: "center", // 수직 중앙 정렬
    alignItems: "center", // 수평 중앙 정렬
  },
  writeButton: {
    position: "absolute",
    right: 20,
    bottom: Platform.OS === "ios" ? 100 : 90, // 하단 네비게이션 바 위에 배치
    backgroundColor: colors.yesDark,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  writeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  footer: {
    padding: 10,
    textAlign: "center",
    color: "#666",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  loginMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginMessageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
