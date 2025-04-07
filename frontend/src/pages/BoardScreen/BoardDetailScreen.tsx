import React from "react";
import {
  View,
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
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import CommentItem from "./components/CommentItem";
import { BoardStackParamList } from "../../shared/page-stack/BoardPageStack";
import { getTimeAgo } from "../../shared/utils/timeAge/timeAge";
import LikeButton from "../../components/LikeButton";
import { Icons } from "../../../assets/icons/Icons";
import PersonalityTag from "../../components/PersonalityTag/PersonalityTag";
import { usePostDetail, useComment } from "../../shared/hooks";
import { useLikeButton } from "../../shared/hooks/useLikeButton";
import Text from "../../components/Common/Text";
import colors from "../../../assets/colors";

// 네비게이션 프롭 타입 정의
type Props = StackScreenProps<BoardStackParamList, "BoardDetail">;

export default function BoardDetailScreen({ route, navigation }: Props) {
  // 라우트 파라미터에서 게시글 ID 가져오기
  const { boardId } = route.params;

  // 게시글 상세 정보 훅
  const { post, loading, error, refresh } = usePostDetail(boardId);

  // 댓글 관련 훅
  const { commentText, setCommentText, submitting, createComment } =
    useComment();

  // 화면에 포커스가 올 때마다 데이터 갱신
  useFocusEffect(
    useCallback(() => {
      if (route.params?.refresh) {
        refresh();
        navigation.setParams({ refresh: undefined });
      }
      return () => {
        // 화면을 떠날 때 정리 작업 (필요한 경우)
      };
    }, [route.params?.refresh, refresh])
  );

  // 댓글 작성 함수
  const handleSubmitComment = async () => {
    if (submitting) return;

    const success = await createComment(boardId);
    if (success) {
      // 댓글 작성 성공 시 게시글 데이터 다시 가져오기
      refresh();
    } else {
      Alert.alert("오류", "댓글 작성에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 게시글 좋아요 상태 변경 핸들러
  const handlePostLikeChange = useCallback(
    (newState: { isLiked: boolean; likeCount: number }) => {
      // 상태는 자동으로 업데이트되므로 추가 처리 필요 없음
      // refresh()를 호출하여 전체 데이터를 다시 가져올 수도 있음
    },
    []
  );

  // 로딩 중이면 로딩 인디케이터 표시
  if (loading && !post) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  // 오류 발생 시
  if (error && !post) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>게시글을 불러오는 데 실패했습니다.</Text>
        <Text>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const likeProps = useLikeButton(
    post?.postId || 0,
    "POST",
    post?.isLiked || false,
    post?.likeCount || 0,
    handlePostLikeChange
  );

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
            <View style={styles.nameContainer}>
              <Text style={styles.authorName}>{post?.nickname}</Text>
              <PersonalityTag
                personality={post?.userType || ""}
                nickname={post?.nickname || ""}
              />
            </View>
            <Text weight="medium" style={styles.postDate}>
              {post?.createdAt ? getTimeAgo(post.createdAt) : ""}
            </Text>
          </View>
        </View>

        {/* 게시글 내용 */}
        <View style={styles.postContent}>
          <Text style={styles.postTitle}>{post?.title}</Text>
          <Text weight="medium" style={styles.postBody}>
            {post?.content}
          </Text>
        </View>

        {/* 댓글 영역 */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsSectionHeader}>
            <View style={styles.interactionContainer}>
              <LikeButton {...likeProps} size="large" isVertical={false} />
              <View style={styles.commentCountContainer}>
                <Icons.commentNew />
                <Text weight="medium" style={styles.commentCountText}>
                  {post?.commentCount || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* 댓글 목록 - 타입 캐스팅으로 해결 */}
          {post?.comments &&
            post.comments.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment as unknown as BoardComment}
                postId={boardId}
                onCommentChange={refresh}
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
          style={[
            styles.commentSubmitButton,
            submitting && styles.commentSubmitButtonDisabled,
          ]}
          onPress={handleSubmitComment}
          disabled={submitting || !commentText.trim()}
        >
          <Text style={styles.commentSubmitText}>
            {submitting ? "등록 중..." : "등록"}
          </Text>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    padding: 18,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 5,
  },
  authorInfo: {
    marginLeft: 15,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  postDate: {
    fontSize: 12,
    color: "#666",
    color: colors.grayText,
    marginTop: 4,
  },
  postContent: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 2,
    marginLeft: 5,
  },
  postTitle: {
    fontSize: 19,
    marginBottom: 8,
  },
  postBody: {
    fontSize: 15,
    lineHeight: 24,
  },
  commentsSection: {
    padding: 16,
  },
  commentsSectionHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  commentsSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  interactionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  commentCountText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f9f9f9",
  },
  commentSubmitButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: "#007BFF",
    borderRadius: 20,
  },
  commentSubmitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  commentSubmitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
