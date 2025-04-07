/**
 * 게시글 목록 API 연결 테스트 컴포넌트
 * 게시글 목록을 불러오고 표시하는 예제입니다.
 */

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { usePostList } from "../../../shared/hooks";

/**
 * 게시글 목록 테스트 컴포넌트
 * @returns JSX.Element
 */
const PostListTest: React.FC = () => {
  // 정렬 방식 상태 (기본값: 최신순)
  const [sortBy, setSortBy] = useState<"latest" | "likes">("latest");

  // usePostList 훅을 사용하여 게시글 목록 로드
  const { posts, popularPosts, loading, error, hasMore, loadMore, refresh } =
    usePostList({ sort: sortBy, limit: 10 });

  // 정렬 방식 변경 핸들러
  const handleChangeSortBy = (newSort: "latest" | "likes") => {
    setSortBy(newSort);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  // 게시글 목록 아이템 렌더러
  const renderPostItem = ({ item }: { item: any }) => (
    <View style={styles.postItem}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent} numberOfLines={2}>
        {item.content}
      </Text>
      <View style={styles.postFooter}>
        <Text style={styles.postInfo}>작성자: {item.nickname}</Text>
        <Text style={styles.postInfo}>날짜: {formatDate(item.createdAt)}</Text>
        <Text style={styles.postInfo}>좋아요: {item.likeCount}</Text>
        <Text style={styles.postInfo}>댓글: {item.commentCount}</Text>
      </View>
    </View>
  );

  // 인기 게시글 렌더러
  const renderPopularPostItem = ({ item }: { item: any }) => (
    <View style={styles.popularPostItem}>
      <Text style={styles.popularPostTitle}>{item.title}</Text>
      <Text style={styles.postInfo}>좋아요: {item.likeCount}</Text>
    </View>
  );

  // 로딩 상태 표시
  if (loading && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>게시글을 불러오는 중...</Text>
      </View>
    );
  }

  // 오류 상태 표시
  if (error && posts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>오류가 발생했습니다.</Text>
        <Text>{error.message}</Text>
        <TouchableOpacity style={styles.button} onPress={refresh}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 정렬 버튼 */}
      <View style={styles.sortButtons}>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "latest" && styles.activeSort]}
          onPress={() => handleChangeSortBy("latest")}
        >
          <Text style={styles.sortButtonText}>최신순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortBy === "likes" && styles.activeSort]}
          onPress={() => handleChangeSortBy("likes")}
        >
          <Text style={styles.sortButtonText}>좋아요순</Text>
        </TouchableOpacity>
      </View>

      {/* 인기 게시글 목록 (수평 스크롤) */}
      {popularPosts.length > 0 && (
        <View style={styles.popularPostsContainer}>
          <Text style={styles.sectionTitle}>인기 게시글</Text>
          <FlatList
            data={popularPosts}
            renderItem={renderPopularPostItem}
            keyExtractor={(item) => `popular-${item.postId}`}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* 게시글 목록 */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => `post-${item.postId}`}
        contentContainerStyle={styles.listContainer}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator
              style={styles.footer}
              size="small"
              color="#999"
            />
          ) : (
            <Text style={styles.footer}>더 이상 게시글이 없습니다.</Text>
          )
        }
        refreshing={loading}
        onRefresh={refresh}
      />
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  sortButtons: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  sortButton: {
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#ececec",
  },
  activeSort: {
    backgroundColor: "#007bff",
  },
  sortButtonText: {
    fontWeight: "600",
  },
  popularPostsContainer: {
    marginVertical: 10,
  },
  popularPostItem: {
    width: 200,
    padding: 15,
    marginLeft: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  popularPostTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  postInfo: {
    fontSize: 12,
    color: "#777",
    marginRight: 10,
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default PostListTest;
