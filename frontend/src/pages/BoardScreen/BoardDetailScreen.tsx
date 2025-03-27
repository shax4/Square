import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { BoardAPI } from "./Api/boardApi";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import CommentItem from "./components/CommentItem";
import { useFocusEffect } from "@react-navigation/native";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";

// 네비게이션 프롭 타입 정의
type Props = StackScreenProps<BoardStackParamList, "BoardDetail">;

// 게시글 상세 정보 타입 정의
interface Post {
  postId: number;
  profileUrl?: string;
  userType: string;
  nickname: string;
  createdAt: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isScrapped: boolean;
  comments: Comment[];
}
// 댓글 정보 타입 정의
interface Comment {
  commentId: number;
  nickname: string;
  profileUrl?: string;
  userType: string;
  createdAt: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  replyCount: number;
  replies: Reply[];
}
// 대댓글 정보 타입 정의
interface Reply {
  replyId: number;
  parentId?: number;
  nickname: string;
  profileUrl?: string;
  userType: string;
  createdAt: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
}

export default function BoardDetailScreen({ route, navigation }: Props) {
  // 라우트 파라미터에서 게시글 ID 가져오기
  const { boardId } = route.params;

  // 게시글 상세 정보를 저장하는 상태
  const [post, setPost] = useState<Post | null>(null); // 게시글 초기값은 null
  // 댓글 입력 내용을 저장하는 상태
  const [commentText, setCommentText] = useState("");
  // 로딩 상태를 관리하는 상태
  const [loading, setLoading] = useState(true);
  // 강제 리렌더링을 위한 카운터 상태
  const [RenderCounter, setRenderCounter] = useState(0);

  // 화면에 포커스가 올 때마다 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      fetchPostDetail();
      return () => {
        // 화면을 떠날 때 정리 작업 (필요한 경우)
      };
    }, [boardId])
  );

  // 컴포넌트가 마운트될 때 게시글 데이터를 가져옴
  useEffect(() => {
    fetchPostDetail();
  }, [boardId]);

  // 게시글 상세 정보를 가져오는 함수
  const fetchPostDetail = async () => {
    try {
      setLoading(true);

      const response = await BoardAPI.getPostDetail(boardId);

      // 상태 업데이트를 강제로 새 객체로 설정
      setPost({ ...response.data });

      // 강제 리렌더링을 위한 카운터 상태 추가
      setRenderCounter((prev) => prev + 1);
    } catch (error) {
      console.error("게시글 상세 정보를 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

  // 댓글 작성 함수
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return; // 빈 댓글은 제출하지 않음

    try {
      await BoardAPI.createComment(boardId, commentText);
      setCommentText(""); // 입력 필드 초기화
      fetchPostDetail(); // 게시글 데이터 다시 가져와서 댓글 목록 갱신
    } catch (error) {
      console.error("댓글 작성에 실패했습니다:", error);
    }
  };

  // 로딩 중이면 로딩 인디케이터 표시
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100} // 키보드가 올라올 때 화면 조정
    >
      <ScrollView style={styles.scrollView}>
        {/* 게시글 헤더 (작성자 정보) */}
        <View style={styles.postHeader}>
          <ProfileImage imageUrl={post?.profileUrl} variant="medium" />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post?.nickname}</Text>
            <Text style={styles.postDate}>{post?.createdAt}</Text>
          </View>
        </View>

        {/* 게시글 내용 */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post?.title}</Text>
          <Text style={styles.postBody}>{post?.content}</Text>
        </View>

        {/* 댓글 영역 */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentSectionTitle}>
            댓글 {post?.commentCount ?? 0}개
          </Text>

          {/* 댓글 목록 */}
          {post?.comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onDelete={() => {
                fetchPostDetail();
              }} // 댓글 삭제 후 게시글 데이터를 다시 불러옴
            />
          ))}
        </View>
      </ScrollView>

      {/* 댓글 입력 영역 */}
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 입력하세요..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity
          style={styles.commentSubmitButton}
          onPress={handleSubmitComment}
        >
          <Text style={styles.commentSubmitText}>등록</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authorInfo: {
    marginLeft: 10,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  postDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  postContent: {
    marginBottom: 24,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postBody: {
    fontSize: 16,
    lineHeight: 24,
  },
  commentsSection: {
    marginTop: 16,
  },
  commentSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 20,
    padding: 10,
    maxHeight: 80,
  },
  commentSubmitButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    paddingHorizontal: 15,
    backgroundColor: "#007BFF",
    borderRadius: 20,
  },
  commentSubmitText: {
    color: "white",
    fontWeight: "bold",
  },
});
