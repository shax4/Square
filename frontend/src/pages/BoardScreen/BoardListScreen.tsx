import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import BoardItem from "./components/BoardItem"; // 개별 게시글 항목을 표시하는 컴포넌트
import EmptyBoardList from "./components/EmptyBoardList"; // 게시글이 없을 때 표시하는 컴포넌트
import { Icons } from "../../../assets/icons/Icons";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";
import { usePostList } from "../../shared/hooks"; // 커스텀 훅 사용

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
  const { posts, popularPosts, loading, error, hasMore, loadMore, refresh } =
    usePostList({ sort: sortBy, limit: 10 });

  // 정렬 방식 변경 시 새로고침
  const handleSortChange = (newSort: "latest" | "likes") => {
    if (sortBy !== newSort) {
      setSortBy(newSort);
    }
  };

  // 화면에 포커스가 올 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        refresh(); // 전체 데이터 새로고침
        navigation.setParams({ refresh: undefined }); // 플래그 초기화
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
            <Text style={styles.sectionTitle}>인기 게시글</Text>
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
              item={item}
              onPress={() =>
                navigation.navigate("BoardDetail", { boardId: item.postId })
              }
            />
          )}
          keyExtractor={(item) => `post-${item.postId}`}
          contentContainerStyle={styles.listContainer}
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
          refreshing={loading}
          onRefresh={refresh}
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
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
    marginBottom: 10,
  },
  popularPostItem: {
    width: 200,
    padding: 15,
    marginLeft: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  popularPostTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  popularPostStats: {
    fontSize: 12,
    color: "#666",
  },
  sortOptions: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 15,
    backgroundColor: "#f1f1f1",
  },
  activeSortButton: {
    backgroundColor: "#007BFF",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
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
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007BFF",
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
});
