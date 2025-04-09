import { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, ActivityIndicator, View } from "react-native";
import CommentCard from "./CommentCard";
import { CommentResponse, Comment } from "../Type/mypageComment";
import { getMypageComments } from "../Api/commentAPI";
import Text from "../../../components/Common/Text";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParamList } from "../../../shared/page-stack/MyPageStack";

interface Props {
  refreshTrigger?: number;
}

const CommentList = ({ refreshTrigger = 0 }: Props) => {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [nextCursorId, setNextCursorId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

  /**
   * 마이페이지 댓글 목록을 가져오는 함수
   * @param cursorId 페이지네이션을 위한 커서 ID (null인 경우 첫 페이지)
   */
  const fetchComments = async (cursorId: number | null) => {
    if (loading) return;

    setLoading(true);
    try {
      const data: CommentResponse = await getMypageComments(cursorId, 10);

      if (cursorId === null && data.comments.length === 0) {
        setIsEmpty(true);
      } else {
        setIsEmpty(false);
      }

      // 첫 페이지인 경우 기존 댓글을 대체하고, 그렇지 않은 경우 기존 댓글에 추가
      if (cursorId === null) {
        setComments(data.comments);
      } else {
        setComments((prev) => [...prev, ...data.comments]);
      }

      setNextCursorId(data.nextCursorId || null);
    } catch (error) {
      console.error("마이페이지 댓글 조회 실패 : ", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 화면에 포커스가 올 때마다 댓글 목록 새로고침
   * - 다른 화면에서 돌아올 때(예: 댓글 삭제 후 마이페이지로 돌아올 때) 데이터 갱신
   */
  useFocusEffect(
    useCallback(() => {
      console.log("마이페이지 댓글 탭에 포커스됨 - 데이터 새로고침");
      // 데이터 초기화 및 새로고침
      setComments([]);
      setNextCursorId(null);
      fetchComments(null);

      // 클린업 함수 (선택 사항)
      return () => {
        // 포커스가 떠날 때 실행될 코드 (필요한 경우)
      };
    }, []) // 의존성 배열이 비어있어 포커스될 때마다 실행됨
  );

  /**
   * refreshTrigger가 변경될 때마다 댓글 목록 새로고침
   */
  useEffect(() => {
    // 데이터 초기화 및 새로고침
    setComments([]);
    setNextCursorId(null);
    fetchComments(null);
  }, [refreshTrigger]);

  /**
   * 무한 스크롤을 위한 추가 데이터 로드 함수
   */
  const loadMore = useCallback(() => {
    if (nextCursorId && !loading) {
      fetchComments(nextCursorId);
    }
  }, [nextCursorId, loading]);

  /**
   * 댓글 클릭 시 해당 게시글 상세 페이지로 이동하는 함수
   */
  const handleCommentPress = useCallback(
    (comment: Comment) => {
      console.log(
        `댓글 선택: postId=${comment.postId}, commentId=${comment.commentId}`
      );
      // 게시글 상세 페이지로 이동하면서 댓글 ID 전달
      navigation.navigate("BoardDetail", {
        boardId: comment.postId,
        focusCommentId: comment.commentId, // 포커싱할 댓글 ID 전달
      });
    },
    [navigation]
  );

  return (
    <FlatList
      data={comments}
      keyExtractor={(item) => item.commentId.toString()}
      renderItem={({ item }) => (
        <CommentCard
          title={item.title}
          content={item.content}
          likeCount={item.likeCount}
          isLiked={item.isLiked}
          onPress={() => handleCommentPress(item)}
          onLikeToggle={(isLiked) =>
            console.log(
              `Like toggled to ${isLiked} for comment ${item.commentId}`
            )
          }
        />
      )}
      contentContainerStyle={styles.listContent}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
      ListEmptyComponent={
        isEmpty ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>댓글이 없습니다.</Text>
          </View>
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "gray",
  },
});

export default CommentList;
