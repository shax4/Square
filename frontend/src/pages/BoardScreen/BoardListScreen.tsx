import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";
import Text from "../../components/Common/Text";
import colors from "../../../assets/colors";

// 인기 게시글 인터페이스
interface PopularPost {
  postId: number;
  title: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}
// 일반 게시글 인터페이스
interface Post {
  postId: number;
  nickname: string;
  profileUrl: string;
  userType: string;
  createdAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
}
// API 응답 인터페이스
interface PostsResponse {
  userType: string | null;
  popular: PopularPost[];
  posts: Post[];
  nextCursorId: number | null;
  nextCursorLikes: number | null;
}

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

export default function BoardListScreen({
  route,
  navigation,
}: BoardListScreenProps) {
  // 정렬 방식 상태 (기본값: 최신순)
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest");

  // usePostList 훅을 사용하여 게시글 목록 관리
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
  } = usePostList({ sort: sortBy, limit: 10 });

  // 정렬 방식 변경 시 새로고침
  const handleSortChange = (newSort: "latest" | "likes") => {
    if (sortBy !== newSort) {
      setSortBy(newSort);
      changeSort(newSort);
    }
  };

  // 화면에 포커스가 올 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        refresh();
        navigation.setParams({ refresh: undefined });
      }
      return () => {
        // 정리 작업 (필요한 경우)
      };
    }, [route.params?.refresh, refresh])
  );

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  // 로딩 상태 표시
  if (loading && posts.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // 오류 상태 표시
  if (error && posts.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류가 발생했습니다.</Text>
        <Text>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 인기 게시글 (캐러셀) */}
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
              좋아요순
            </Text>
          </TouchableOpacity>
        </View>

        {/* 게시글 목록 */}
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <BoardItem
              item={{ ...item, userType: item.userType || "" }}
              onPress={() =>
                navigation.navigate("BoardDetail", { boardId: item.postId })
              }
            />
          )}
          keyExtractor={(item) => `post-${item.postId}`}
          contentContainerStyle={{
            ...styles.listContainer,
            ...styles.listContent,
          }}
          ListEmptyComponent={<EmptyBoardList />}
          onEndReached={loadMore}
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
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListHeaderComponent={() => (
            <View style={styles.postsHeader}>
              <Text style={styles.sectionTitle}>게시글 목록</Text>
            </View>
          )}
        />

        {/* 글쓰기 버튼 */}
        <TouchableOpacity
          style={styles.writeButton}
          onPress={() =>
            navigation.navigate("BoardWrite", { postId: undefined })
          }
        >
          <Text style={styles.writeButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 스타일 정의
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
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
    backgroundColor: "#007BFF",
  },
  sortText: {
    color: colors.grayText,
  },
  activeSortText: {
    color: "#fff",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 80, // writeButton을 위한 공간
  },
  writeButton: {
    position: "absolute",
    bottom: 20,
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
  postsHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});
