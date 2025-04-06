import React from "react";
import { View, Text, StyleSheet } from "react-native";
import LikeButton from "../LikeButton";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { TargetType } from "../LikeButton.types";

/**
 * 게시글 목록 아이템 컴포넌트 예시
 *
 * @description 게시글 목록에서 각 아이템을 표시하는 컴포넌트 예시입니다.
 * LikeButton 사용 패턴의 일관성을 위한 참고용 코드입니다.
 */
const BoardItemExample = ({ post }: { post: any }) => {
  // 대상 타입 (게시글)
  const targetType: TargetType = "POST";

  // useLikeButton 훅으로 공통 props 생성
  const likeProps = useLikeButton(
    post.postId, // 게시글 ID
    targetType, // 게시글 타입
    post.isLiked, // 초기 좋아요 상태
    post.likeCount // 초기 좋아요 개수
    // 상태 변경 콜백은 목록에서는 생략 가능 (성능 이슈 방지)
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <Text numberOfLines={2}>{post.content}</Text>
      </View>

      {/* LikeButton 사용 - 게시글 목록에서는 항상 small 크기, 가로 배치 */}
      <LikeButton {...likeProps} size="small" isVertical={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default BoardItemExample;
