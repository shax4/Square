import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BoardAPI } from "../BoardScreen/Api/BoardApi"; // 게시판 API 호출
import BoardItem from "./components/BoardItem"; // 개별 게시글 항목을 표시하는 컴포넌트
import PopularPostItem from "./components/PopularPostItem"; // 인기 게시글 컴포넌트

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

// 네비게이션 파라미터 타입 정의
type BoardStackParamList = {
  BoardList: undefined; // 목록 확인 시에는 필요 파라미터 없음
  BoardDetail: { boardId: number }; // 게시글 상세 정보 확인 시에는 boardId 참조
  BoardWrite: { postId?: number }; // 게시글 수정 시에는 postId 참조 (작성 시에는 postId 없으므로 ? 기호로 선택적 파라미터임을 표시)
};

// 네비게이션 프롭 타입 정의
type BoardListScreenNavigationProp = StackNavigationProp<
  BoardStackParamList,
  "BoardList"
>;

// props 타입 정의
interface BoardListScreenProps {
  navigation: BoardListScreenNavigationProp;
}

export default function BoardListScreen({ navigation }: BoardListScreenProps) {
  const [boards, setBoards] = useState<Post[]>([]); // 게시글 목록 데이터 상태 관리
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]); // 인기 게시글 목록 데이터 상태 관리
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태 관리
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [nextCursorLikes, setNextCursorLikes] = useState<number | null>(null);
  const [sort, setSort] = useState<"latest" | "likes">("latest"); // 정렬 방식

  // 컴포넌트가 처음 렌더링 될 때 게시글 데이터를 가져옵니다.
  useEffect(() => {
    fetchBoards(true); // 처음 로드 시 새로고침
  }, [sort]); // 정렬 방식이 변경되면 데이터 다시 로드

  // 게시글 목록을 서버에서 가져오는 함수
  const fetchBoards = async (refresh = false) => {
    try {
      setLoading(true); // 로딩 상태를 true로 설정
      // 새로고침 시 커서 초기화
      const cursor = refresh ? null : nextCursorId;
      const response = await BoardAPI.getPosts(
        sort,
        cursor,
        sort === "likes" ? nextCursorLikes : null,
        10 // limit
      );

      const data = response.data as PostsResponse;

      // 새로고침 또는 첫 로드 시 전체 데이터 설정, 그렇지 않으면 추가
      if (refresh) {
        setBoards(data.posts);
        setPopularPosts(data.popular);
      } else {
        setBoards((prev) => [...prev, ...data.posts]);
      }

      setNextCursorId(data.nextCursorId);
      setNextCursorLikes(data.nextCursorLikes);
    } catch (error) {
      console.error("게시글 목록을 불러오는 데 실패했습니다:", error);
      Alert.alert("오류", "게시글 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false); // 로딩 상태를 false로 설정
    }
  };

  const handleSortChange = (newSort: "latest" | "likes") => {
    setSort(newSort);
  };

  return loading && boards.length === 0 ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#007BFF" />
    </View>
  ) : (
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
            sort === "latest" && styles.activeSortButton,
          ]}
          onPress={() => handleSortChange("latest")}
        >
          <Text
            style={sort === "latest" ? styles.activeSortText : styles.sortText}
          >
            최신순
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.sortButton,
            sort === "likes" && styles.activeSortButton,
          ]}
          onPress={() => handleSortChange("likes")}
        >
          <Text
            style={sort === "likes" ? styles.activeSortText : styles.sortText}
          >
            좋아요순
          </Text>
        </TouchableOpacity>
      </View>

      {/* 게시글 목록 */}
      <FlatList
        data={boards}
        renderItem={({ item }) => (
          <BoardItem
            item={item}
            onPress={() =>
              navigation.navigate("BoardDetail", { boardId: item.postId })
            }
          />
        )}
        keyExtractor={(item) => item.postId.toString()}
        onEndReached={() => {
          if (nextCursorId || nextCursorLikes) {
            fetchBoards();
          }
        }}
        onEndReachedThreshold={0.1}
      />

      {/* 글쓰기 버튼 */}
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => navigation.navigate("BoardWrite", { postId: undefined })}
      >
        <Text style={styles.writeButtonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  popularSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  popularPostItem: {
    width: 150,
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
  },
  popularPostTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  popularPostStats: {
    fontSize: 12,
    color: "#666",
  },
  sortOptions: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sortButton: {
    marginRight: 16,
    paddingVertical: 4,
  },
  activeSortButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#007BFF",
  },
  sortText: {
    color: "#666",
  },
  activeSortText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  writeButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007BFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  writeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
