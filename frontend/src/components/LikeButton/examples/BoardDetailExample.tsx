import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LikeButton from "../LikeButton";
import { useLikeButton } from "../../../shared/hooks/useLikeButton";
import { TargetType } from "../LikeButton.types";

/**
 * 게시글 상세 화면 컴포넌트 예시
 *
 * @description 게시글 상세 페이지에서 좋아요 버튼 사용 예시입니다.
 * LikeButton 사용 패턴의 일관성을 위한 참고용 코드입니다.
 */
const BoardDetailExample = ({ initialPost }: { initialPost: any }) => {
  // 게시글 상세 정보 상태 관리
  const [post, setPost] = useState(initialPost);

  // 대상 타입 (게시글)
  const targetType: TargetType = "POST";

  // 좋아요 상태 변경 시 실행될 콜백 함수
  const handleLikeChange = ({
    isLiked,
    likeCount,
  }: {
    isLiked: boolean;
    likeCount: number;
  }) => {
    // 게시글 상세 데이터 업데이트
    setPost({
      ...post,
      isLiked,
      likeCount,
    });

    // 필요 시 API 호출이나 다른 처리를 추가할 수 있음
    console.log(
      `게시글 ${post.postId} 좋아요 상태 변경: ${isLiked}, 개수: ${likeCount}`
    );
  };

  // useLikeButton 훅으로 공통 props 생성 (콜백 포함)
  const likeProps = useLikeButton(
    post.postId,
    targetType,
    post.isLiked,
    post.likeCount,
    handleLikeChange // 상세 화면에서는 상태 업데이트를 위해 콜백 제공
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.author}>{post.nickname}</Text>
        <Text style={styles.date}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.content}>{post.content}</Text>

      <View style={styles.actionContainer}>
        {/* LikeButton 사용 - 상세 화면에서는 large 크기, 수직 배치, 상세 에러 표시 */}
        <LikeButton
          {...likeProps}
          size="large"
          isVertical={true}
          errorDisplayMode="detailed" // 상세 화면에서는 자세한 에러 메시지 표시
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  author: {
    fontWeight: "500",
    marginRight: 10,
  },
  date: {
    color: "#666",
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  actionContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});

export default BoardDetailExample;
