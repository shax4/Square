import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LikeButton from "../LikeButton";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { TargetType } from "../LikeButton.types";

/**
 * 댓글 아이템 컴포넌트 예시
 *
 * @description 댓글 목록에서 각 댓글 아이템을 표시하는 컴포넌트 예시입니다.
 * LikeButton 사용 패턴의 일관성을 위한 참고용 코드입니다.
 */
const CommentItemExample = ({
  comment,
  onCommentUpdate,
}: {
  comment: any;
  onCommentUpdate?: (commentId: number, updates: any) => void;
}) => {
  // 대상 타입 (댓글)
  const targetType: TargetType = "POST_COMMENT";

  // 좋아요 상태 변경 콜백
  const handleLikeChange = ({
    isLiked,
    likeCount,
  }: {
    isLiked: boolean;
    likeCount: number;
  }) => {
    // 부모 컴포넌트에 상태 변경 알림 (댓글 목록 상태 업데이트)
    if (onCommentUpdate) {
      onCommentUpdate(comment.commentId, { isLiked, likeCount });
    }
  };

  // useLikeButton 훅으로 공통 props 생성
  const likeProps = useLikeButton(
    comment.commentId, // 댓글 ID
    targetType, // 댓글 타입
    comment.isLiked, // 초기 좋아요 상태
    comment.likeCount, // 초기 좋아요 개수
    handleLikeChange // 상태 변경 콜백
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.nickname}>{comment.nickname}</Text>
        <Text style={styles.date}>
          {new Date(comment.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.content}>{comment.content}</Text>

      <View style={styles.footer}>
        {/* LikeButton 사용 - 댓글에서는 항상 small 크기, 가로 배치 */}
        <LikeButton {...likeProps} size="small" isVertical={false} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  header: {
    flexDirection: "row",
    marginBottom: 5,
  },
  nickname: {
    fontWeight: "bold",
    marginRight: 10,
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  content: {
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});

export default CommentItemExample;
